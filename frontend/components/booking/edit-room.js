import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllRoomsApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';
import axios from 'axios';

function EditRoom({
  setBookingData,
  bookingData,
  setShow,
  daysCount,
  session,
}) {
  const [productList, setProductList] = useState([]);
  const [roomItems, setRoomItems] = useState(
    bookingData?.components?.roomDetails?.length
      ? bookingData?.components?.roomDetails
      : []
  );
  const [roomPrice, setRoomPrice] = useState(
    bookingData?.price_components?.roomPrice
      ? bookingData?.price_components?.roomPrice
      : []
  );

  useEffect(() => {
    const handlePreselectedRoom = async () => {
      const preselectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
      localStorage.removeItem('selectedRoom');
      // Get the room data and include to bookingData.components.roomDetails
      const singleRoomApi = await axios.get(
        `/api/booking/get-room-data-api?roomId=${preselectedRoom.roomId}`
      );
      const singleRoomData = singleRoomApi.data;
      singleRoomData.value = singleRoomData.id;
      singleRoomData.label =
        singleRoomData.roomtype?.room_type_name +
        ': ' +
        singleRoomData.room_number;
      singleRoomData.price = singleRoomData.roomtype?.price;

      singleRoomData.room_count = 1;
      singleRoomData.room_cost = Math.max(
        daysCount > 0
          ? singleRoomData.roomtype?.price * daysCount
          : singleRoomData.roomtype?.price,
        0
      );

      handleSelect(singleRoomData);
    };

    const fetchPackageList = async () => {
      const allProductList = await listAllRoomsApi();
      const filteredExistingItems = allProductList.filter(
        (item) => !roomItems.some((existingItem) => existingItem.id === item.id)
      );
      setProductList(
        filteredExistingItems.map((obj, index) => {
          return {
            ...obj,
            value: obj.id,
            label: obj.roomtype?.room_type_name + ': ' + obj.room_number,
            price: obj.roomtype?.price,
          };
        })
      );
    };
    fetchPackageList();
    if (localStorage.getItem('selectedRoom')) handlePreselectedRoom();
  }, []);

  const handleDeleteItem = async (index) => {
    setRoomItems(
      roomItems.filter((item, currentIndex) => currentIndex !== index)
    );

    updateStateObject(
      setRoomPrice,
      'rackPrice',
      sumOfKey(
        roomItems.filter((item, currentIndex) => currentIndex !== index),
        'room_cost'
      )
    );

    updateStateObject(
      setRoomPrice,
      'priceAfterDiscount',
      Math.floor(
        sumOfKey(
          roomItems.filter((item, currentIndex) => currentIndex !== index),
          'room_cost'
        )
      ) || 0
    );
    setProductList([
      ...productList,
      ...roomItems.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  const handleDiscountChange = (e) => {
    updateStateObject(setRoomPrice, 'priceAfterDiscount', e.target.value);
    updateStateObject(
      setRoomPrice,
      'discount',
      roundUptoFixedDigits(
        ((roomPrice.rackPrice - e.target.value) * 100) / roomPrice.rackPrice,
        2
      )
    );
  };

  const handleSelect = (value) => {
    value.room_count = 1;
    value.room_cost = Math.max(
      daysCount > 0 ? value.roomtype?.price * daysCount : value.roomtype?.price,
      0
    );

    setRoomItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.id));

    updateStateObject(
      setRoomPrice,
      'rackPrice',
      (roomPrice.rackPrice || 0) + value.room_cost
    );
    updateStateObject(
      setRoomPrice,
      'discount',
      roundUptoFixedDigits(
        (((roomPrice.rackPrice || 0) +
          value.room_cost -
          Math.floor((roomPrice.rackPrice || 0) + value.room_cost)) *
          100) /
          (roomPrice.rackPrice || 0) +
          value.room_cost,
        2
      ) || 0
    );
    updateStateObject(
      setRoomPrice,
      'priceAfterDiscount',
      Math.floor((roomPrice.rackPrice || 0) + value.room_cost) || 0
    );
    updateStateObject(setRoomPrice, 'discountNotes', '-');
  };

  const handleSubmit = async () => {
    //If discount over threshold
    const maxDiscountSlab = await getMaxDiscountSlab();
    if (
      ((roomPrice.rackPrice - roomPrice.priceAfterDiscount) * 100) /
        roomPrice.rackPrice >
      maxDiscountSlab
    ) {
      alert(`Discount is above maximum allowed percentage`);
      return false;
    }
    setBookingData((currentData) => ({
      ...currentData,
      components: {
        ...currentData.components,
        roomDetails: roomItems,
      },
      price_components: {
        ...currentData.price_components,
        roomPrice: {
          ...roomPrice,
          discount: roundUptoFixedDigits(
            ((roomPrice.rackPrice - roomPrice.priceAfterDiscount) * 100) /
              roomPrice.rackPrice,
            2
          ),
        },
      },
      booking_status: 'discountApprovalPending',
    }));
    setShow(false);
  };

  return (
    <div>
      {/* Dropdown element for all items */}
      <div className="py-2">
        <label>Select room</label>
        <Select
          options={productList}
          onChange={(value) => handleSelect(value)}
        />
      </div>

      {/* New version */}
      {roomItems.map(
        (
          { name, price, room_number, room_count, room_cost, roomtype },
          index
        ) => (
          <Row
            key={index}
            className="custom-form arrow-hidden  mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
            <Col md={5} xs={6}>
              {/* {name} */}
              {roomtype.room_type_name}: {room_number}
              {/* Input for mobile screen */}
              <div className="d-block d-sm-none">
                <input
                  type="number"
                  disabled
                  className="py-0 text-end w-75px"
                  name={`itemCount_${index}`}
                  value={room_count}
                />
                <span className="font-small ms-1">Number of Rooms</span>
              </div>
            </Col>
            {/* Input for laptop */}
            <Col md={3} className="d-none d-sm-block">
              <input
                type="number"
                disabled
                className="py-0 text-end w-100px"
                min={0}
                name={`itemCount_${index}`}
                value={room_count}
              />
              <span className="font-small mx-3">Number of Rooms</span>
            </Col>
            <Col md={3} xs={5} className="text-end">
              {BDTFormat.format(room_cost || 0)}
            </Col>
            <Col md={1} xs={1}>
              <div className="circular-button-wrapper">
                <ReactiveButton
                  buttonState="idle"
                  rounded
                  color="red"
                  buttonType="filled"
                  className="circular-button"
                  idleText={
                    <Icon
                      nameIcon="FaTimesCircle"
                      propsIcon={{ size: 18, color: '#fff' }}
                    />
                  }
                  onClick={() => handleDeleteItem(index)}
                />
              </div>
            </Col>
          </Row>
        )
      )}

      {/* Total menu cost */}
      <div className="mx-3 mx-sm-0">
        <Row className="border-top border-1 border-dark pt-2 align-items-start custom-form">
          <Col
            xs={4}
            md={6}
            className="text-end font-small p-0 d-flex align-items-center justify-content-end">
            Total Cost (BDT)
          </Col>
          <Col md={2} xs={0} className="d-none d-md-block"></Col>
          <Col md={3} xs={8} className="d-flex justify-content-end">
            <input
              name="packageCost"
              type="text"
              value={BDTFormat.format(sumOfKey(roomItems, 'room_cost') || 0)}
              disabled
              className="font-small my-0 py-1 fw-bold text-end rounded-0"
            />
          </Col>
        </Row>

        <Row className="my-3 custom-form arrow-hidden">
          <Col
            xs={4}
            md={6}
            className="text-end font-small p-0 d-flex align-items-center justify-content-end">
            Discounted Cost (BDT)
          </Col>
          <Col md={2} xs={0} className="d-none d-md-block"></Col>
          <Col md={3} xs={7} className="">
            <input
              name="discountedPrice"
              type="number"
              max={Math.round(sumOfKey(roomItems, 'room_cost')) || 0}
              min={Math.round(sumOfKey(roomItems, 'room_cost') * 0.5) || 0}
              value={Math.floor(roomPrice.priceAfterDiscount) || 0}
              onChange={(e) => {
                handleDiscountChange(e);
              }}
              className="font-small my-0 py-1 fw-bold text-end rounded-0"
            />
          </Col>
          <Col
            md={1}
            xs={1}
            className="label-text p-0 d-flex align-items-center">
            {roundUptoFixedDigits(
              ((roomPrice.rackPrice - roomPrice.priceAfterDiscount) * 100) /
                roomPrice.rackPrice,
              2
            )}
            %
          </Col>
        </Row>

        <Row className="my-3 custom-form">
          <Col
            xs={4}
            md={6}
            className="text-end font-small p-0 d-flex align-items-center justify-content-end">
            Discount Notes
          </Col>
          <Col md={5} xs={8} className="">
            <textarea
              value={roomPrice.discountNotes}
              onChange={(e) => {
                updateStateObject(
                  setRoomPrice,
                  'discountNotes',
                  e.target.value
                );
              }}
            />
          </Col>
        </Row>
      </div>

      <Row>
        <Col md={11} className="d-flex justify-content-end mt-4">
          <ReactiveButton
            buttonState="idle"
            idleText="Submit"
            color="green"
            onClick={handleSubmit}
          />
        </Col>
      </Row>
    </div>
  );
}

export default EditRoom;
