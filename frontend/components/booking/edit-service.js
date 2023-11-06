import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllServicesApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';

function EditService({ setBookingData, bookingData, setShow }) {
  const [productList, setProductList] = useState([]);
  const [serviceItems, setServiceItems] = useState(
    bookingData?.components?.serviceDetails?.length
      ? bookingData?.components?.serviceDetails
      : []
  );
  const [servicePrice, setServicePrice] = useState(
    bookingData?.price_components?.servicePrice
      ? bookingData?.price_components?.servicePrice
      : []
  );

  useEffect(() => {
    const fetchPackageList = async () => {
      const allProductList = await listAllServicesApi();
      const filteredExistingItems = allProductList.filter(
        (item) =>
          !serviceItems.some((existingItem) => existingItem.id === item.id)
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
    setServiceItems(
      serviceItems.filter((item, currentIndex) => currentIndex !== index)
    );

    updateStateObject(
      setServicePrice,
      'rackPrice',
      sumOfKey(
        serviceItems.filter((item, currentIndex) => currentIndex !== index),
        'service_cost'
      )
    );

    updateStateObject(
      setServicePrice,
      'priceAfterDiscount',
      Math.floor(
        sumOfKey(
          serviceItems.filter((item, currentIndex) => currentIndex !== index),
          'service_cost'
        )
      ) || 0
    );
    setProductList([
      ...productList,
      ...serviceItems.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  const handleItemCountChange = (e, index) => {
    updateStateArray(
      index,
      'service_count',
      e.target.value,
      setServiceItems,
      serviceItems
    );
    updateStateArray(
      index,
      'service_cost',
      Math.max(e.target.value * serviceItems[index].price, 0),
      setServiceItems,
      serviceItems
    );
    updateStateObject(
      setServicePrice,
      'rackPrice',
      sumOfKey(serviceItems, 'service_cost')
    );
    updateStateObject(
      setServicePrice,
      'discount',
      roundUptoFixedDigits(
        ((sumOfKey(serviceItems, 'service_cost') -
          Math.floor(sumOfKey(serviceItems, 'service_cost'))) *
          100) /
          sumOfKey(serviceItems, 'service_cost'),
        2
      ) || 0
    );
    updateStateObject(
      setServicePrice,
      'priceAfterDiscount',
      Math.floor(sumOfKey(serviceItems, 'service_cost')) || 0
    );
    updateStateObject(setServicePrice, 'discountNotes', '-');
  };

  const handleDiscountChange = (e) => {
    updateStateObject(setServicePrice, 'priceAfterDiscount', e.target.value);
    updateStateObject(
      setServicePrice,
      'discount',
      roundUptoFixedDigits(
        ((servicePrice.rackPrice - e.target.value) * 100) /
          servicePrice.rackPrice,
        2
      )
    );
  };

  const handleSelect = (value) => {
    setServiceItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.id));
  };

  const handleSubmit = async () => {
    //If discount over threshold
    const maxDiscountSlab = await getMaxDiscountSlab();
    if (
      ((servicePrice.rackPrice - servicePrice.priceAfterDiscount) * 100) /
        servicePrice.rackPrice >
      maxDiscountSlab
    ) {
      alert(`Discount is above maximum allowed percentage`);
      return false;
    }
    setBookingData((currentData) => ({
      ...currentData,
      components: {
        ...currentData.components,
        serviceDetails: serviceItems,
      },
      price_components: {
        ...currentData.price_components,
        servicePrice: {
          ...servicePrice,
          discount: roundUptoFixedDigits(
            ((servicePrice.rackPrice - servicePrice.priceAfterDiscount) * 100) /
              servicePrice.rackPrice,
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
        <label>Select service</label>
        <Select
          options={productList}
          onChange={(value) => handleSelect(value)}
        />
      </div>

      {/* New version */}
      {serviceItems.map(
        ({ name, price, service_count, service_cost }, index) => (
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
                  value={service_count}
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
                value={service_count}
                onChange={(e) => handleItemCountChange(e, index)}
              />
              <span className="font-small mx-3">Portions</span>
            </Col>
            <Col md={3} xs={5} className="text-end">
              {BDTFormat.format(service_cost || 0)}
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
                sumOfKey(serviceItems, 'service_cost') || 0
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
              max={Math.round(sumOfKey(serviceItems, 'service_cost')) || 0}
              min={
                Math.round(sumOfKey(serviceItems, 'service_cost') * 0.01) || 0
              }
              value={Math.floor(servicePrice.priceAfterDiscount) || 0}
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
              ((servicePrice.rackPrice - servicePrice.priceAfterDiscount) *
                100) /
                servicePrice.rackPrice,
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
              value={servicePrice.discountNotes}
              onChange={(e) => {
                updateStateObject(
                  setServicePrice,
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

export default EditService;
