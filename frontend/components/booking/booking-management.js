import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { PropagateLoader, RiseLoader } from 'react-spinners';
import * as Yup from 'yup';

import {
  CustomTextInput,
  FormDatePicker,
} from '@/components/_commom/form-elements';

import { Icon } from '@/components/_commom/Icon';
import {
  addBookingApi,
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
import AdvancedCreations from '@/components/advanced/create-advanced';

import {
  readFromStorage,
  removeStorage,
  writeToStorage,
} from '@/components/_functions/storage-variable-management';
import { fetchGuestApi } from '@/api/guest-api';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';
import { updateStateObject } from '@/components/_functions/common-functions';
import CancelBooking from './cancel-booking';
import axios from 'axios';
import ViewVenues from './view-venues';

const validationRules = Yup.object({
  checkInDate: Yup.date()
    .nullable()
    .required('Check-in Date is required')
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
});

const componentList = [
  { id: 1, name: 'Package', icon: 'FaBoxes', type: 'package' },
  { id: 2, name: 'Prixfixe', icon: 'FaUtensils', type: 'prixfixe' },
  { id: 3, name: 'À la carte', icon: 'FaUtensilSpoon', type: 'alacarte' },
  { id: 4, name: 'Room', icon: 'MdLocalHotel', type: 'room' },
  { id: 5, name: 'Services', icon: 'FaTableTennis', type: 'service' },
  { id: 6, name: 'Venue', icon: 'MdMeetingRoom', type: 'venue' },
];

function BookingManagement({ bookingId, isNew, session }) {
  const [bookingData, setBookingData] = useState({});
  const [guestData, setGuestData] = useState({});
  const [discountData, setDiscountData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [componentType, setComponentType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [editable, setEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [referesh, setReferesh] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
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
      const userId = session.user.id;
      const guestDataTemp = await fetchGuestApi(guestId);
      setGuestData(guestDataTemp);
      updateStateObject(setBookingData, 'guest_id', guestId);
      updateStateObject(setBookingData, 'user_id', userId);
      setEditable(true);
      setIsLoading(false);
    };

    setShowEditModal(localStorage.getItem('selectedRoom') ? true : false)
    setComponentType(localStorage.getItem('selectedRoom') ? 'room' : '')

    if (!isNew && bookingId) getBookingData();
    if (isNew) getGuestInfo();

    setReferesh(false);
  }, [bookingId, isNew, referesh, session.user.id]);

  const handleSubmitBooking = async (values) => {
    if (!bookingData.price_components) {
      setButtonState('idle');
      setErrorMessage('No booking components!');
      return false;
    }
    setButtonState('loading');
    if (!isNew) {
      const apiResult = await modifyBookingApi(bookingData, discountData);
      alert(
        apiResult.success
          ? `Booking modified. Current status: "${camelCaseToCapitalizedString(
              apiResult.dbBooking.result[1][0].booking_status
            )}"`
          : 'Something went wrong'
      );

      if (apiResult.dbBooking.success) {
        setErrorMessage('');
        router.push(`show-booking?id=${apiResult.dbBooking.result[1][0].id}`);
        setButtonState('idle');
      } else {
        setIsLoading(false);
        setErrorMessage(apiResult.message);
        setButtonState('error');
      }
    } else {
      const apiResult = await addBookingApi(
        bookingData,
        values.checkInDate,
        values.checkOutDate
      );

      if(apiResult.success === false) {
        setIsLoading(false);
        setErrorMessage(apiResult.message);
        setButtonState('error');
        return false;
      }

      if (apiResult.dbBooking.success === true) {
        setIsLoading(true);
        setErrorMessage('');
        removeStorage('GUEST_KEY');
        router.push(`show-booking?id=${apiResult.dbBooking.dbResult.id}`);
        setButtonState('idle');
      } else {
        setIsLoading(false);
        setErrorMessage(apiResult.message);
        setButtonState('error');
      }
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  if (!guestData) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <h3 className="text-danger">
          You have to select the primary guest first
        </h3>
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
          onSubmit={(values) => handleSubmitBooking(values)}>
          {(formik) => {
            const { values } = formik;
            return (
              <Form>
                <div className="d-flex justify-content-between">
                  <h4 className="mb-4">
                    Booking Details: {bookingData.booking_ref}
                  </h4>
                  {/* Buttons for large screen */}
                  {bookingData.booking_status !== 'cancelled' && (
                    <div className="d-md-flex d-none">
                      {!isNew &&
                        bookingData.booking_status !== 'discountRejected' && (
                          <div className="mx-2">
                            <ReactiveButton
                              buttonState="idle"
                              idleText={
                                <span className="fw-bold fs-6">Advanced</span>
                              }
                              color="indigo"
                              size="small"
                              className="rounded-1 py-1 bg-gradient"
                              disabled={
                                bookingData.booking_status ===
                                'discountApprovalPending'
                              }
                              onClick={() => {
                                setShowAdvanced(true);
                              }}
                            />
                          </div>
                        )}

                      {!isNew && (
                        <div className="mx-2">
                          <ReactiveButton
                            buttonState="idle"
                            idleText={
                              <span className="fw-bold fs-6">Cancel</span>
                            }
                            color="red"
                            size="small"
                            className="rounded-1 py-1 bg-gradient"
                            onClick={() => {
                              setShowCancel(true);
                            }}
                          />
                        </div>
                      )}

                      <div className="edit-component ms-3">
                        <Dropdown>
                          <Dropdown.Toggle
                            id="add-action"
                            variant="dark"
                            className="btn btn-one my-0 py-1 px-2 rounded-1 bg-gradient">
                            <span className="mx-2">Edit Component</span>{' '}
                            <Icon
                              nameIcon="FaCaretDown"
                              propsIcon={{ size: 12 }}
                            />
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            className="dropdown-menu-custom"
                            variant="dark">
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
                                <Icon
                                  nameIcon={icon}
                                  propsIcon={{ size: 20 }}
                                />
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  )}{' '}
                </div>

                {/* Buttons for mobile */}
                {bookingData.booking_status !== 'cancelled' && (
                  <div className="d-flex d-md-none justify-content-between mb-3">
                    {!isNew &&
                      bookingData.booking_status !== 'discountRejected' && (
                        <div className="mx-2">
                          <ReactiveButton
                            buttonState="idle"
                            idleText={
                              <span className="fw-bold fs-6">Advanced</span>
                            }
                            color="indigo"
                            size="small"
                            className="rounded-1 py-1 bg-gradient"
                            onClick={() => {
                              setShowAdvanced(true);
                            }}
                          />
                        </div>
                      )}

                    {!isNew && (
                      <div className="mx-2">
                        <ReactiveButton
                          buttonState="idle"
                          idleText={
                            <span className="fw-bold fs-6">Cancel</span>
                          }
                          color="red"
                          size="small"
                          className="rounded-1 py-1 bg-gradient"
                          onClick={() => {
                            setShowCancel(true);
                          }}
                        />
                      </div>
                    )}

                    <div className="edit-component mx-2">
                      <Dropdown>
                        <Dropdown.Toggle
                          id="add-action"
                          variant="dark"
                          className="btn btn-one my-0 py-1 px-2 rounded-1 bg-gradient">
                          <span className="mx-2">Component</span>{' '}
                          <Icon
                            nameIcon="FaCaretDown"
                            propsIcon={{ size: 12 }}
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                          className="dropdown-menu-custom"
                          variant="dark">
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
                  </div>
                )}

                <Row className="m-0 py-2 border border-grey">
                  <h4>Guest Information</h4>
                  <Col sm={12} className="border-bottom">
                    <p className="mb-1">
                      <span className="text-muted me-3">Name:</span>
                      {guestData?.name}
                    </p>
                  </Col>

                  <Col sm={6}>
                    <p className="mb-1">
                      <span className="text-muted me-3">Phone:</span>
                      {guestData?.phone}
                    </p>
                  </Col>

                  <Col sm={6}>
                    <p className="mb-1">
                      <span className="text-muted me-3">Email:</span>
                      {guestData?.email}
                    </p>
                  </Col>

                  <Col sm={12}>
                    <p className="mb-1">
                      <span className="text-muted me-3">Address:</span>
                      {guestData?.address}
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
                  {bookingData?.components?.packageDetails?.length >0 && (
                    <ViewPackages
                      selectedPackages={bookingData.components.packageDetails}
                      priceDetails={bookingData.price_components?.packagePrice}
                    />
                  )}
                </div>

                {/* Room details */}
                <div className="my-2">
                  {bookingData?.components?.roomDetails?.length > 0 && (
                    <ViewRooms
                      selectedProducts={bookingData.components.roomDetails}
                      priceDetails={bookingData.price_components?.roomPrice}
                    />
                  )}
                </div>

                {/* Venue details */}
                <div className="my-2">
                  {bookingData?.components?.venueDetails?.length > 0 && (
                    <ViewVenues
                      selectedProducts={bookingData.components.venueDetails}
                      priceDetails={bookingData.price_components?.venuePrice}
                    />
                  )}
                </div>

                {/* Prixfixe details */}
                <div className="my-2">
                  {bookingData?.components?.prixfixeDetails?.length > 0 && (
                    <ViewPrixfixe
                      selectedProducts={bookingData.components?.prixfixeDetails}
                      priceDetails={bookingData.price_components?.prixfixePrice}
                    />
                  )}
                </div>

                {/* Alacarte details */}
                <div className="my-2">
                  {bookingData?.components?.alacarteDetails?.length >0 && (
                    <ViewAlacarte
                      selectedProducts={bookingData.components.alacarteDetails}
                      priceDetails={bookingData.price_components?.alacartePrice}
                    />
                  )}
                </div>

                {/* Services details */}
                <div className="my-2">
                  {bookingData?.components?.serviceDetails?.length >0 && (
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
                    disabled={bookingData.booking_status === 'canceled'}
                    value={bookingData.booking_notes || ''}
                    onChange={(e) => {
                      setBookingData((currentData) => ({
                        ...currentData,
                        booking_notes: e.target.value,
                      }));
                    }}
                  />

                  {/* Submit button */}
                  {bookingData.booking_status !== 'cancelled' && (
                    <div className="d-flex justify-content-end my-3">
                      <ReactiveButton
                        buttonState={buttonState}
                        idleText={
                          <span className="fw-bold fs-6">
                            {isNew ? 'Create ' : 'Modify'}
                          </span>
                        }
                        type="submit"
                        color="green"
                        size="small"
                        className="rounded-1 py-1 bg-gradient"
                        loadingText={
                          <RiseLoader
                            color="#ffffff"
                            size={5}
                            speedMultiplier={2}
                          />
                        }
                        successText={
                          <span className="d-flex justify-content-center">
                            <Icon nameIcon="FaRegThumbsUp" />
                          </span>
                        }
                        messageDuration={2000}
                        animation={true}
                      />
                    </div>
                  )}
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
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
                  session={session}
                />
              </Form>
            );
          }}
        </Formik>
      </div>

      <AdvancedCreations
        show={showAdvanced}
        setShow={setShowAdvanced}
        bookingData={bookingData}
        setReferesh={setReferesh}
        session={session}
      />

      <CancelBooking
        show={showCancel}
        setShow={setShowCancel}
        bookingData={bookingData}
        setReferesh={setReferesh}
      />
    </div>
  );
}

export default BookingManagement;
