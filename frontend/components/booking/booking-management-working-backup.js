import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import * as Yup from 'yup';

import {
  CustomTextInput,
  CustomSelect,
  FormDatePicker,
  CustomTextArea,
} from '@/components/_commom/form-elements';

import { Icon } from '@/components/_commom/Icon';
import {
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

const componentList = [
  { id: 1, name: 'Package', icon: 'FaBoxes', type: 'package' },
  { id: 2, name: 'Prixfixe', icon: 'FaUtensils', type: 'prixfixe' },
  { id: 3, name: 'À la carte', icon: 'FaUtensilSpoon', type: 'alacarte' },
  { id: 4, name: 'Room', icon: 'MdLocalHotel', type: 'room' },
  { id: 5, name: 'Services', icon: 'FaTableTennis', type: 'service' },
];

function BookingManagement({ bookingId, isNew }) {
  const [bookingData, setBookingData] = useState({});
  const [guestData, setGuestData] = useState({});
  const [discountData, setDiscountData] = useState({});
  const [editable, setEditable] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [componentType, setComponentType] = useState('');
  const toDay = new Date();

  useEffect(() => {
    const getBookingData = async () => {
      const bookingDataTemp = await getSingleBookingApi(bookingId);
      setBookingData(bookingDataTemp.bookingData);
      setGuestData(bookingDataTemp.guestData);
      setDiscountData(bookingDataTemp.discountData);
      setIsLoading(false);
    };
    if (!isNew && bookingId) getBookingData();
    if (isNew) {
      setEditable(true);
      setIsLoading(false);
    }
  }, [bookingId, isNew]);

  const handleSubmitBooking = async () => {
    await modifyBookingApi(bookingData, discountData);
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between">
        <h2 className="mb-4">Booking Details</h2>

        {/* Buttons for large screen */}
        <div className="d-md-flex d-none">
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText={
                <div className="d-flex justify-content-around align-items-center">
                  <span className="fw-bold fs-6 mx-2">
                    {editable ? 'Edit Date' : 'Edit Date'}
                  </span>
                  <Icon nameIcon="FaCalendarCheck" propsIcon={{ size: 14 }} />
                </div>
              }
              color="primary"
              size="small"
              className="rounded-1 py-1 bg-gradient"
              // outline
              onClick={() => {
                setEditable(!editable);
              }}
            />
          </div>

          <div className="edit-component mx-3">
            <Dropdown>
              <Dropdown.Toggle
                id="add-action"
                variant="dark"
                className="btn btn-one my-0 py-1 px-2 rounded-1 bg-gradient">
                <span className="mx-2">Edit Component</span>{' '}
                <Icon nameIcon="FaCaretDown" propsIcon={{ size: 12 }} />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-custom" variant="dark">
                {componentList.map(({ id, name, icon, type }) => (
                  <Dropdown.Item
                    key={id}
                    href="#"
                    className="btn btn-three d-flex justify-content-between px-3"
                    onClick={() => {
                      setComponentType(type);
                      setShowEditModal(true);
                    }}>
                    {name}
                    <Icon nameIcon={icon} propsIcon={{ size: 20 }} />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText={<span className="fw-bold fs-6">Submit</span>}
              color="green"
              size="small"
              className="rounded-1 py-1 bg-gradient"
              // outline
              onClick={() => {
                handleSubmitBooking();
              }}
            />
          </div>
        </div>
      </div>

      {/* Buttons for mobile */}
      <div className="d-flex d-md-none justify-content-between mb-3">
        <div className="mx-2">
          <ReactiveButton
            buttonState="idle"
            idleText={
              <div className="d-flex justify-content-around align-items-center">
                <span className="fw-bold fs-6 mx-2">Date</span>
                <Icon nameIcon="FaCalendarCheck" propsIcon={{ size: 14 }} />
              </div>
            }
            color="blue"
            size="small"
            className="rounded-1 py-1 bg-gradient"
            // outline
            onClick={() => {
              setEditable(!editable);
            }}
          />
        </div>

        <div className="edit-component mx-3">
          <Dropdown>
            <Dropdown.Toggle
              id="add-action"
              variant="dark"
              className="btn btn-one my-0 py-1 px-2 rounded-1 bg-gradient">
              <span className="mx-2">Component</span>{' '}
              <Icon nameIcon="FaCaretDown" propsIcon={{ size: 12 }} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-custom" variant="dark">
              {componentList.map(({ id, name, icon, type }) => (
                <Dropdown.Item
                  key={id}
                  href="#"
                  className="btn btn-three d-flex justify-content-between px-3"
                  onClick={() => {
                    setComponentType(type);
                    setShowEditModal(true);
                  }}>
                  {name}
                  <Icon nameIcon={icon} propsIcon={{ size: 20 }} />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="mx-2">
          <ReactiveButton
            buttonState="idle"
            idleText={<span className="fw-bold fs-6">Submit</span>}
            color="green"
            size="small"
            className="rounded-1 py-1 bg-gradient"
            // outline
            onClick={() => {
              handleSubmitBooking();
            }}
          />
        </div>
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

      <div className="custom-form pt-3">
        <Formik
          initialValues={{
            checkInDate: toDay,
            checkOutDate: toDay,
            // checkInDate: new Date(bookingData?.checkin_date) || toDay,
            // checkOutDate: new Date(bookingData?.checkout_date) || toDay,
            guestId: bookingData?.guest_id,
            userId: bookingData?.user_id,
            notes: bookingData?.booking_notes,
            currency: 'BDT',
          }}
          validationSchema={validationRules}
          onSubmit={(values) => handleSubmit(values)}>
          {(formik) => {
            const { values } = formik;
            return (
              <Form>
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

                {/* Add notes */}
                <div className="my-3">
                  <label>Booking Notes</label>
                  <textarea
                    name="bookingNotes"
                    label="Booking Notes"
                    onChange={(e) => {
                      setBookingData((currentData) => ({
                        ...currentData,
                        booking_notes: e.target.value,
                      }));
                    }}
                  />

                  {/* Submit button */}
                  <div className="d-flex justify-content-end my-3">
                    <ReactiveButton
                      buttonState="idle"
                      idleText={<span className="fw-bold fs-6">Submit</span>}
                      color="green"
                      size="small"
                      className="rounded-1 py-1 bg-gradient"
                      // outline
                      onClick={() => {
                        handleSubmitBooking();
                      }}
                    />
                  </div>
                </div>

                <AddBookingComponent
                  show={showEditModal}
                  setShow={setShowEditModal}
                  componentType={componentType}
                  setBookingData={setBookingData}
                  bookingData={bookingData}
                  daysCount={Math.floor(
                    (values.checkOutDate - values.checkInDate) /
                      (1000 * 60 * 60 * 24)
                  )}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default BookingManagement;
