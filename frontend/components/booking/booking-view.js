import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import * as Yup from 'yup';

import {
  CustomTextInput,
  FormDatePicker,
} from '@/components/_commom/form-elements';

import { Icon } from '@/components/_commom/Icon';
import {
  addBookingApi,
  createBookingApi,
  getSingleBookingApi,
  modifyBookingApi,
} from '@/api/booking-api';
import ViewPackages from './view-packages';
import ViewRooms from './view-rooms';
import ViewPrixfixe from './view-prixfixe';
import ViewAlacarte from './view-alacarte';
import ViewServices from './view-services';
import PriceInformation from './price-information';
import ReactiveButton from 'reactive-button';
import AddBookingComponent from './add-booking-component';
import { readFromStorage } from '@/components/_functions/storage-variable-management';
import { fetchGuestApi } from '@/api/guest-api';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';
import { updateStateObject } from '@/components/_functions/common-functions';

const validationRules = Yup.object({
  checkInDate: Yup.date()
    .nullable()
    .required('Check-in Date is required')
    // .min(new Date(), 'Check-in Date must be later than today')
    .test(
      'is-greater',
      'Check-in date cannot be lower than today',
      function (value) {
        const thisDay = new Date().setHours(0, 0, 0, 0);
        return !thisDay || !value || value >= thisDay;
      }
    ),
  checkOutDate: Yup.date()
    .nullable()
    .required('Check-out Date is required')
    .test(
      'is-greater',
      'Check-out date must be same day or later than check-in date',
      function (value) {
        const { checkInDate } = this.parent;
        return !checkInDate || !value || value >= checkInDate;
      }
    ),
  currency: Yup.string().oneOf(['BDT', 'USD'], 'Invalid currency'),
});

function BookingView({ bookingId, isNew }) {
  const [bookingData, setBookingData] = useState({});
  const [guestData, setGuestData] = useState({});
  const [discountData, setDiscountData] = useState({});
  const [editable, setEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toDay = new Date();

  useEffect(() => {
    const getBookingData = async () => {
      const bookingDataTemp = await getSingleBookingApi(bookingId);
      setBookingData(bookingDataTemp.bookingData);
      setGuestData(bookingDataTemp.guestData);
      setDiscountData(bookingDataTemp.discountData);
      setIsLoading(false);
    };

    const getGuestInfo = async () => {
      const guestId = readFromStorage('GUEST_KEY');
      const userId = readFromStorage('USER_KEY');
      const guestDataTemp = await fetchGuestApi(guestId);
      setGuestData(guestDataTemp);
      updateStateObject(setBookingData, 'guest_id', guestId);
      updateStateObject(setBookingData, 'user_id', userId);
      setEditable(true);
      setIsLoading(false);
    };

    if (!isNew && bookingId) getBookingData();
    if (isNew) getGuestInfo();
  }, [bookingId, isNew]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <div className="my-3">
      <div className="custom-form pt-3">
        <Formik
          initialValues={{
            checkInDate: new Date(bookingData?.checkin_date || toDay),
            checkOutDate: new Date(bookingData?.checkout_date || toDay),
            notes: bookingData?.booking_notes,
            currency: 'BDT',
          }}
          validationSchema={validationRules}
          onSubmit={(values) => handleSubmit(values)}>
          {(formik) => {
            const { values } = formik;
            return (
              <Form>
                <div className="d-flex justify-content-between">
                  <h2 className="mb-4">
                    Booking Details: {bookingData.booking_ref}
                  </h2>
                </div>

                <Row className="m-0 py-2 border border-grey">
                  <h4>Guest Information</h4>
                  <Col sm={12} className="border-bottom">
                    <p className="mb-1">
                      <span className="text-muted me-3">Name:</span>
                      {guestData.name}
                    </p>
                  </Col>

                  <Col sm={6}>
                    <p className="mb-1">
                      <span className="text-muted me-3">Phone:</span>
                      {guestData.phone}
                    </p>
                  </Col>

                  <Col sm={6}>
                    <p className="mb-1">
                      <span className="text-muted me-3">Email:</span>
                      {guestData.email}
                    </p>
                  </Col>

                  <Col sm={12}>
                    <p className="mb-1">
                      <span className="text-muted me-3">Address:</span>
                      {guestData.address}
                    </p>
                  </Col>
                </Row>

                {/* Checkin and checkout */}
                <Row className="m-0 py-2 border border-grey">
                  <h4 className="mb-3 bg-light">Visit Date</h4>
                  <Col md={6}>
                    {editable ? (
                      <FormDatePicker
                        name="checkInDate"
                        label="Check-in Date"
                        dateDistance={1}
                      />
                    ) : (
                      <div>
                        <CustomTextInput
                          type="text"
                          label="Check-in Date"
                          name="checkInDate"
                          id="checkInDate"
                          value={bookingData.checkin_date}
                          disabled
                        />
                      </div>
                    )}
                  </Col>

                  <Col md={6}>
                    {editable ? (
                      <FormDatePicker
                        name="checkOutDate"
                        label="Check-out Date"
                        dateDistance={7}
                        startDate={values.checkInDate?.setHours(0, 0, 0, 0)}
                      />
                    ) : (
                      <div>
                        <CustomTextInput
                          type="text"
                          label="Check-out Date"
                          name="checkOutDate"
                          id="checkOutDate"
                          value={bookingData.checkout_date}
                          disabled
                        />
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Package details */}
                <div className="my-2">
                  {bookingData?.components?.packageDetails?.length && (
                    <ViewPackages
                      selectedPackages={bookingData.components.packageDetails}
                      priceDetails={bookingData.price_components?.packagePrice}
                    />
                  )}
                </div>

                {/* Room details */}
                <div className="my-2">
                  {bookingData?.components?.roomDetails?.length && (
                    <ViewRooms
                      selectedProducts={bookingData.components.roomDetails}
                      priceDetails={bookingData.price_components?.roomPrice}
                    />
                  )}
                </div>

                {/* Prixfixe details */}
                <div className="my-2">
                  {bookingData?.components?.prixfixeDetails?.length && (
                    <ViewPrixfixe
                      selectedProducts={bookingData.components?.prixfixeDetails}
                      priceDetails={bookingData.price_components?.prixfixePrice}
                    />
                  )}
                </div>

                {/* Alacarte details */}
                <div className="my-2">
                  {bookingData?.components?.alacarteDetails?.length && (
                    <ViewAlacarte
                      selectedProducts={bookingData.components.alacarteDetails}
                      priceDetails={bookingData.price_components?.alacartePrice}
                    />
                  )}
                </div>

                {/* Services details */}
                <div className="my-2">
                  {bookingData?.components?.serviceDetails?.length && (
                    <ViewServices
                      selectedProducts={bookingData.components.serviceDetails}
                      priceDetails={bookingData.price_components?.servicePrice}
                    />
                  )}
                </div>

                {/* Price details */}
                <div className="my-2">
                  <PriceInformation
                    bookingDetails={bookingData}
                    discountDetails={discountData}
                  />
                </div>

                {/* Notes and submit button */}
                <div className="my-3">
                  {/* Add notes */}
                  <label>Booking Notes</label>
                  <textarea
                    name="bookingNotes"
                    label="Booking Notes"
                    disabled
                    value={bookingData.booking_notes}
                    onChange={(e) => {
                      setBookingData((currentData) => ({
                        ...currentData,
                        booking_notes: e.target.value,
                      }));
                    }}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default BookingView;
