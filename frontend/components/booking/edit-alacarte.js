import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllAlacarteApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';

function EditAlacarte({ setBookingData, bookingData, setShow }) {
  const [productList, setProductList] = useState([]);
  const [alacarteItems, setAlacarteItems] = useState(
    bookingData?.components?.alacarteDetails?.length
      ? bookingData?.components?.alacarteDetails
      : []
  );
  const [alacartePrice, setAlacartePrice] = useState(
    bookingData?.price_components?.alacartePrice
      ? bookingData?.price_components?.alacartePrice
      : []
  );

  useEffect(() => {
    const fetchPackageList = async () => {
      const allProductList = await listAllAlacarteApi();
      const filteredExistingItems = allProductList.filter(
        (item) =>
          !alacarteItems.some((existingItem) => existingItem.id === item.id)
      );
      setProductList(
        filteredExistingItems.map((obj, index) => {
          return { ...obj, value: index, label: obj.name };
        })
      );
    };
    fetchPackageList();
  }, []);

  const handleDeleteItem = (index) => {
    setAlacarteItems(
      alacarteItems.filter((item, currentIndex) => currentIndex !== index)
    );

    updateStateObject(
      setAlacartePrice,
      'rackPrice',
      sumOfKey(
        alacarteItems.filter((item, currentIndex) => currentIndex !== index),
        'alacarte_cost'
      )
    );

    updateStateObject(
      setAlacartePrice,
      'priceAfterDiscount',
      Math.floor(
        sumOfKey(
          alacarteItems.filter((item, currentIndex) => currentIndex !== index),
          'alacarte_cost'
        )
      ) || 0
    );
    setProductList([
      ...productList,
      ...alacarteItems.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  const handleItemCountChange = (e, index) => {
    updateStateArray(
      index,
      'alacarte_count',
      e.target.value,
      setAlacarteItems,
      alacarteItems
    );
    updateStateArray(
      index,
      'alacarte_cost',
      Math.max(e.target.value * alacarteItems[index].price, 0),
      setAlacarteItems,
      alacarteItems
    );
    updateStateObject(
      setAlacartePrice,
      'rackPrice',
      sumOfKey(alacarteItems, 'alacarte_cost')
    );
    updateStateObject(
      setAlacartePrice,
      'discount',
      roundUptoFixedDigits(
        ((sumOfKey(alacarteItems, 'alacarte_cost') -
          Math.floor(sumOfKey(alacarteItems, 'alacarte_cost'))) *
          100) /
          sumOfKey(alacarteItems, 'alacarte_cost'),
        2
      ) || 0
    );
    updateStateObject(
      setAlacartePrice,
      'priceAfterDiscount',
      Math.floor(sumOfKey(alacarteItems, 'alacarte_cost')) || 0
    );
    updateStateObject(setAlacartePrice, 'discountNotes', '-');
  };

  const handleDiscountChange = (e) => {
    updateStateObject(setAlacartePrice, 'priceAfterDiscount', e.target.value);
    updateStateObject(
      setAlacartePrice,
      'discount',
      roundUptoFixedDigits(
        ((alacartePrice.rackPrice - e.target.value) * 100) /
          alacartePrice.rackPrice,
        2
      )
    );
  };

  const handleSelect = (value) => {
    setAlacarteItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.id));
  };

  const handleSubmit = async () => {
    //If discount over threshold
    const maxDiscountSlab = await getMaxDiscountSlab();
    if (
      ((alacartePrice.rackPrice - alacartePrice.priceAfterDiscount) * 100) /
        alacartePrice.rackPrice >
      maxDiscountSlab
    ) {
      alert(`Discount is above maximum allowed percentage`);
      return false;
    }
    setBookingData((currentData) => ({
      ...currentData,
      components: {
        ...currentData.components,
        alacarteDetails: alacarteItems,
      },
      price_components: {
        ...currentData.price_components,
        alacartePrice: {
          ...alacartePrice,
          discount: roundUptoFixedDigits(
            ((alacartePrice.rackPrice - alacartePrice.priceAfterDiscount) *
              100) /
              alacartePrice.rackPrice,
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
        <label>Select alacarte menu</label>
        <Select
          options={productList}
          onChange={(value) => handleSelect(value)}
        />
      </div>

      {/* New version */}
      {alacarteItems.map(
        ({ name, price, alacarte_count, alacarte_cost }, index) => (
          <Row
            key={index}
            className="custom-form arrow-hidden  mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
            <Col md={5} xs={6}>
              {name}
              {/* Input for mobile screen */}
              <div className="d-block d-sm-none">
                <input
                  type="number"
                  className="py-0 text-end w-75px"
                  name={`itemCount_${index}`}
                  value={alacarte_count}
                  onChange={(e) => handleItemCountChange(e, index)}
                />
                <span className="font-small ms-1">Portions</span>
              </div>
            </Col>
            {/* Input for laptop */}
            <Col md={3} className="d-none d-sm-block">
              <input
                type="number"
                className="py-0 text-end w-100px"
                min={0}
                name={`itemCount_${index}`}
                value={alacarte_count}
                onChange={(e) => handleItemCountChange(e, index)}
              />
              <span className="font-small mx-3">Portions</span>
            </Col>
            <Col md={3} xs={5} className="text-end">
              {BDTFormat.format(alacarte_cost || 0)}
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
              value={BDTFormat.format(
                sumOfKey(alacarteItems, 'alacarte_cost') || 0
              )}
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
              max={Math.round(sumOfKey(alacarteItems, 'alacarte_cost')) || 0}
              min={
                Math.round(sumOfKey(alacarteItems, 'alacarte_cost') * 0.5) || 0
              }
              value={Math.floor(alacartePrice.priceAfterDiscount) || 0}
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
              ((alacartePrice.rackPrice - alacartePrice.priceAfterDiscount) *
                100) /
                alacartePrice.rackPrice,
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
              value={alacartePrice.discountNotes}
              onChange={(e) => {
                updateStateObject(
                  setAlacartePrice,
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

export default EditAlacarte;
