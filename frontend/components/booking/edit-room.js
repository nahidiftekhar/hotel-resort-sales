import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllRoomsApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';
import axios from 'axios';
import { FormDatePicker } from '../_commom/form-elements';
import { Formik } from 'formik';
import { formatDate } from '../_functions/date-functions';

const toDay = new Date();

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
  const [customError, setCustomError] = useState('');

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

  const handleAddRoom = (value) => {
    if (!value.roomId) {
      setCustomError('Please select a room');
      return false;
    }
    if (value.checkInDate > value.checkOutDate) {
      setCustomError('Check-in date cannot be greater than check-out date');
      return false;
    }

    const bookingDuration = Math.floor(
      (value.checkOutDate - value.checkInDate) / (1000 * 60 * 60 * 24)
    );
    value.room_count = 1;
    value.room_cost = Math.max(
      bookingDuration > 0
        ? value.roomtype?.price * bookingDuration
        : value.roomtype?.price,
      0
    );
    setRoomItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.roomId));

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
      <Formik
        initialValues={{
          checkInDate: new Date(bookingData?.checkin_date || toDay),
          checkOutDate: new Date(bookingData?.checkout_date || toDay),
          notes: bookingData?.booking_notes,
          currency: 'BDT',
          roomtype: {},
          roomId: 0,
          room_name: '',
          room_number: '',
        }}>
        {(formik) => {
          const { values, setValues } = formik;
          return (
            <Form>
              <Row className="py-2 custom-form">
                <Col md={5}>
                  <label>Select room</label>
                  <Select
                    name="roomId"
                    options={productList}
                    onChange={(obj) => {
                      setValues({
                        ...values,
                        roomId: obj.value,
                        roomtype: obj.roomtype,
                        room_name: obj.room_name,
                        room_number: obj.room_number,
                      });
                      setCustomError('');
                    }}
                  />
                </Col>
                <Col md={3}>
                  <FormDatePicker
                    name="checkInDate"
                    label="Check-in Date"
                    dateDistance={1}
                  />
                </Col>
                <Col md={3}>
                  <FormDatePicker
                    name="checkOutDate"
                    label="Check-out Date"
                    dateDistance={1}
                  />
                </Col>
                <Col md={1} className="d-flex align-items-center">
                  <div className="reactive-button-wauto">
                    <ReactiveButton
                      buttonState="idle"
                      rounded
                      color="blue"
                      className="circular-button"
                      idleText={
                        <Icon
                          nameIcon="FaPlus"
                          propsIcon={{ size: 18, color: '#fff' }}
                        />
                      }
                      onClick={() => {
                        handleAddRoom(values);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>

      {roomItems?.length > 0 && (
        <Row className="fw-bold custom-form arrow-hidden mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
          <Col md={4} xs={6}>
            Room
          </Col>
          {/* Input for laptop */}
          <Col md={2} className="d-none d-sm-block">
            Check-in
          </Col>
          <Col md={2} className="d-none d-sm-block">
            Check-out
          </Col>
          <Col md={3} xs={5} className="text-end">
            Price
          </Col>
        </Row>
      )}

      {roomItems.map(
        (
          {
            name,
            price,
            room_number,
            room_count,
            room_cost,
            roomtype,
            checkInDate,
            checkOutDate,
          },
          index
        ) => (
          <Row
            key={index}
            className="custom-form arrow-hidden mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
            <Col md={4} xs={6}>
              {/* {name} */}
              {roomtype.room_type_name}: {room_number}
              <div className="d-sm-none smaller-label">
                {formatDate(checkInDate)} to {formatDate(checkOutDate)}
              </div>
            </Col>
            {/* Input for laptop */}
            <Col md={2} className="d-none d-sm-block">
              {formatDate(checkInDate)}
            </Col>
            <Col md={2} className="d-none d-sm-block">
              {formatDate(checkOutDate)}
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
              min={Math.round(sumOfKey(roomItems, 'room_cost') * 0.01) || 0}
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
          {customError && <p className="error-message">{customError}</p>}
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
