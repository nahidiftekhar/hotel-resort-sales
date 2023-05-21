import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import ReactiveButton from 'reactive-button';
import { Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import {
  CustomTextInput,
  CustomSelect,
  FormDatePicker,
  CustomTextArea,
} from '@/components/_commom/form-elements';

import ProductSelection from './product-selection';
import CreateDiscount from '../discounts/create-discount';
import { createBookingApi } from '@/api/booking-api';
import { readFromStorage } from '@/components/_functions/storage-variable-management';
import { PropagateLoader } from 'react-spinners';

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

function BookingFrom() {
  const [bookingData, setBookingData] = useState({});
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [bookingAdded, setBookingAdded] = useState(false);
  const [bookingEdit, setBookingEdit] = useState(true);
  const toDay = new Date();
  const priceBeforeDiscount =
    (bookingData.totalPackageCost || 0) +
    (bookingData.totalPrixfixeCost || 0) +
    (bookingData.totalRoomCost || 0) +
    (bookingData.totalAlacarteCost || 0) +
    (bookingData.totalServiceCost || 0);

  const router = useRouter();

  useEffect(() => {
    const userId = readFromStorage('USER_KEY');
    const guestId = readFromStorage('GUEST_KEY');
    setBookingData((currentData) => ({ ...currentData, guestId, userId }));
    if (guestId <= 0) router.push('/guests');
  }, []);

  const handleSubmit = async (values) => {
    const createBooking = await createBookingApi(values, bookingData);
    if (createBooking.success) {
      setShowDiscountModal(true);
      setBookingAdded(true);
      setBookingEdit(false);
      setBookingData({ ...bookingData, bookingId: createBooking.dbResult.id });
    }
  };

  if (!bookingData.guestId)
    return <PropagateLoader color="#0860ae" size={10} />;

  return (
    <div className="custom-form mw-800 pt-3">
      <h2 className="text-center">Add Booking</h2>
      <Formik
        initialValues={{
          checkInDate: toDay,
          checkOutDate: toDay,
          // checkOutDate: new Date().setDate(toDay.getDate() + 7),
          guestId: bookingData.guestId,
          userId: bookingData.userId,
          notes: '',
          currency: 'BDT',
        }}
        validationSchema={validationRules}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form>
              <Row>
                <Col md={6} className="py-2">
                  <FormDatePicker
                    name="checkInDate"
                    label="Check-in Date"
                    dateDistance={1}
                  />
                </Col>

                <Col md={6} className="py-2">
                  <FormDatePicker
                    name="checkOutDate"
                    label="Check-out Date"
                    dateDistance={7}
                    startDate={values.checkInDate?.setHours(0, 0, 0, 0)}
                  />
                </Col>

                {/* Product selection */}
                <div className="my-3">
                  <ProductSelection
                    setBookingData={setBookingData}
                    bookingData={bookingData}
                    daysCount={Math.floor(
                      (values.checkOutDate - values.checkInDate) /
                        (1000 * 60 * 60 * 24)
                    )}
                  />
                </div>

                <Col md={6} className="py-2"></Col>
                <Col md={6}>
                  <div className="py-1 px-3 my-3 bg-light border rounded-1 fw-bold d-flex justify-content-between">
                    <p className="m-0">Total Cost (BDT)</p>
                    <p className="m-0">
                      {(bookingData.totalPackageCost || 0) +
                        (bookingData.totalPrixfixeCost || 0) +
                        (bookingData.totalRoomCost || 0) +
                        (bookingData.totalAlacarteCost || 0) +
                        (bookingData.totalServiceCost || 0)}
                    </p>
                  </div>
                </Col>

                <Col md={12} className="py-2">
                  <CustomTextArea
                    label="Notes"
                    name="notes"
                    placeholder="Any additional notes"
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                {bookingEdit ? (
                  <ReactiveButton
                    type={'submit'}
                    buttonState="idle"
                    size="small"
                    outline
                    idleText={
                      <span className="fw-bold">Create Reservation</span>
                    }
                    color="blue"
                  />
                ) : (
                  ''
                  // !(
                  //   bookingData.discountStatus === 'selfApproved' ||
                  //   bookingData.discountStatus === 'pendingApproval'
                  // ) && (
                  //   <ReactiveButton
                  //     buttonState="idle"
                  //     size="small"
                  //     outline
                  //     idleText={<span className="fw-bold">Modify Booking</span>}
                  //     color="blue"
                  //     onClick={() => setBookingEdit(true)}
                  //   />
                  // )
                )}
              </div>
            </Form>
          );
        }}
      </Formik>

      {bookingData.discountPercentage ? (
        <div className="border rounded p-1 my-2">
          <h4>Discount</h4>
          <div className="d-flex justify-content-between bg-light border rounded px-2 p-1 my-2">
            <span>Price before discount (BDT)</span>
            <span className="ms-2 fw-bold">{priceBeforeDiscount}</span>
          </div>
          <Row className="mx-0 my-2 p-0">
            <Col md={5} className="m-0 px-1">
              <div className="d-flex justify-content-between border bg-light rounded px-1 p-1 my-2">
                <span>Discount percentage</span>
                <span className="ms-2 fw-bold text-primary">
                  {bookingData.discountPercentage}
                </span>
              </div>
            </Col>
            <Col md={5} className="m-0 px-1">
              <div className="d-flex justify-content-between border bg-light rounded px-1 p-1 my-2">
                <span>Discount status</span>
                <span className="ms-2 fw-bold text-primary">
                  {bookingData.discountStatus}
                </span>
              </div>
            </Col>
            <Col md={2}>
              <div className="d-flex justify-content-center px-1 p-1 my-2">
                <ReactiveButton
                  size="small"
                  outline
                  color="blue"
                  buttonState="idle"
                  idleText={<div className="fw-bold">View Status</div>}
                  onClick={() => setShowDiscountModal(true)}
                  className="py-0"
                />
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-between border rounded px-2 p-1 mb-3">
            <span>Price after discount (BDT)</span>
            <span className="ms-2 fw-bold">
              {bookingData.discountPercentage > 50
                ? priceBeforeDiscount
                : priceBeforeDiscount *
                  (1 - bookingData.discountPercentage / 100)}
            </span>
          </div>
        </div>
      ) : (
        bookingAdded && (
          <div className="border rounded p-1 pb-3 my-2">
            <h4>Discount</h4>
            <div className="d-flex justify-content-between">
              No discount applied.{' '}
              <ReactiveButton
                size="small"
                outline
                color="blue"
                buttonState="idle"
                idleText={<div className="fw-bold">Add discount</div>}
                onClick={() => setShowDiscountModal(true)}
              />
            </div>
          </div>
        )
      )}

      <CreateDiscount
        show={showDiscountModal}
        setShow={setShowDiscountModal}
        bookingData={bookingData}
        setBookingData={setBookingData}
      />
    </div>
  );
}

export default BookingFrom;
