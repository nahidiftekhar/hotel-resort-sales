import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllVenuesApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';
import { FormDatePicker } from '../_commom/form-elements';
import { Form, Formik } from 'formik';
import { formatDate } from '../_functions/date-functions';
const toDay = new Date();

function EditVenue({ setBookingData, bookingData, setShow }) {
  const [productList, setProductList] = useState([]);
  const [venueItems, setVenueItems] = useState(
    bookingData?.components?.venueDetails?.length
      ? bookingData?.components?.venueDetails
      : []
  );
  const [venuePrice, setVenuePrice] = useState(
    bookingData?.price_components?.venuePrice
      ? bookingData?.price_components?.venuePrice
      : []
  );
  const [customError, setCustomError] = useState('');

  useEffect(() => {
    const fetchPackageList = async () => {
      const allProductList = await listAllVenuesApi();
      const filteredExistingItems = allProductList.filter(
        (item) =>
          !venueItems.some((existingItem) => existingItem.id === item.id)
      );
      setProductList(
        filteredExistingItems.map((obj, index) => {
          return { ...obj, value: obj.id, label: obj.venue_name };
        })
      );
    };
    fetchPackageList();
  }, []);

  const handleDeleteItem = (index) => {
    setVenueItems(
      venueItems.filter((item, currentIndex) => currentIndex !== index)
    );

    updateStateObject(
      setVenuePrice,
      'rackPrice',
      sumOfKey(
        venueItems.filter((item, currentIndex) => currentIndex !== index),
        'venue_cost'
      )
    );

    updateStateObject(
      setVenuePrice,
      'priceAfterDiscount',
      Math.floor(
        sumOfKey(
          venueItems.filter((item, currentIndex) => currentIndex !== index),
          'venue_cost'
        )
      ) || 0
    );
    setProductList([
      ...productList,
      ...venueItems.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  const handleAddVenue = (value) => {
    if(!value.venueId) {
      setCustomError('Please select a venue');
      return false;
    }
    if(value.checkInDate > value.checkOutDate) {
      setCustomError('Check-in date cannot be greater than check-out date');
      return false;
    }
    const bookingDuration = Math.floor(
      (value.checkOutDate - value.checkInDate) /
        (1000 * 60 * 60 * 24)
    ) + 1;
    value.venue_count = 1;
    value.venue_cost = Math.max(
      bookingDuration > 0 ? value.price * bookingDuration : value.price,
      0
    );
    setVenueItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.roomId));

    updateStateObject(
      setVenuePrice,
      'rackPrice',
      (venuePrice.rackPrice || 0) + value.venue_cost
    );
    updateStateObject(
      setVenuePrice,
      'discount',
      roundUptoFixedDigits(
        (((venuePrice.rackPrice || 0) +
          value.venue_cost -
          Math.floor((venuePrice.rackPrice || 0) + value.venue_cost)) *
          100) /
          (venuePrice.rackPrice || 0) +
          value.venue_cost,
        2
      ) || 0
    );
    updateStateObject(
      setVenuePrice,
      'priceAfterDiscount',
      Math.floor((venuePrice.rackPrice || 0) + value.venue_cost) || 0
    );
    updateStateObject(setVenuePrice, 'discountNotes', '-');
  };

  const handleDiscountChange = (e) => {
    updateStateObject(setVenuePrice, 'priceAfterDiscount', e.target.value);
    updateStateObject(
      setVenuePrice,
      'discount',
      roundUptoFixedDigits(
        ((venuePrice.rackPrice - e.target.value) * 100) /
          venuePrice.rackPrice,
        2
      )
    );
  };

  const handleSubmit = async () => {
    //If discount over threshold
    const maxDiscountSlab = await getMaxDiscountSlab();
    if (
      ((venuePrice.rackPrice - venuePrice.priceAfterDiscount) * 100) /
        venuePrice.rackPrice >
      maxDiscountSlab
    ) {
      alert(`Discount is above maximum allowed percentage`);
      return false;
    }
    setBookingData((currentData) => ({
      ...currentData,
      components: {
        ...currentData.components,
        venueDetails: venueItems,
      },
      price_components: {
        ...currentData.price_components,
        venuePrice: {
          ...venuePrice,
          discount: roundUptoFixedDigits(
            ((venuePrice.rackPrice - venuePrice.priceAfterDiscount) *
              100) /
              venuePrice.rackPrice,
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
          venueId: 0,
          venue_name: '',
        }}>
        {(formik) => {
          const { values, setValues } = formik;
          return (
            <Form>
              <Row className="py-2 custom-form">
                <Col md={5}>
                  <label>Select Venue</label>
                  <Select
                    name="venueId"
                    options={productList}
                    onChange={(obj) => {
                      setValues({
                        ...values,
                        venueId: obj.value,
                        venue_name: obj.venue_name,
                        price: obj.price,
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
                        handleAddVenue(values);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>

      {venueItems?.length > 0 && (
        <Row
          className="fw-bold custom-form arrow-hidden mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
          <Col md={4} xs={6}>Venue</Col>
          {/* Input for laptop */}
          <Col md={2} className="d-none d-sm-block">Check-in</Col>
          <Col md={2} className="d-none d-sm-block">Check-out</Col>
          <Col md={3} xs={5} className="text-end">Price</Col>
        </Row>
      )}

      {venueItems.map(
        (
          {
            name,
            price,
            venue_name,
            venue_count,
            venue_cost,
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
              {venue_name}
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
              {BDTFormat.format(venue_cost || 0)}
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
              value={BDTFormat.format(sumOfKey(venueItems, 'venue_cost') || 0)}
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
              max={Math.round(sumOfKey(venueItems, 'venue_cost')) || 0}
              min={Math.round(sumOfKey(venueItems, 'venue_cost') * 0.5) || 0}
              value={Math.floor(venuePrice.priceAfterDiscount) || 0}
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
              ((venuePrice.rackPrice - venuePrice.priceAfterDiscount) * 100) /
                venuePrice.rackPrice,
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
              value={venuePrice.discountNotes}
              onChange={(e) => {
                updateStateObject(
                  setVenuePrice,
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
        {customError && <p className="error-message text-center">{customError}</p>}
      </Row>
    </div>
  );
}

export default EditVenue;
