import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { CustomTextArea, FormDatePicker } from '../_commom/form-elements';
import ReactiveButton from 'reactive-button';
import * as Yup from 'yup';
import axios from 'axios';
import {
  dateStringFormattedToDate,
  formatDateYYYYMMDDwithDash,
} from '../_functions/date-functions';

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
  roomId: Yup.string().required('Did you select the room correctly!'),
});

function AddReservation({ show, setShow, existingRecord, session }) {
  const router = useRouter();
  const isNew = Object.keys(existingRecord).length === 0;
  const selectedDate = dateStringFormattedToDate(
    existingRecord.reservation_date || formatDateYYYYMMDDwithDash(new Date()),
    '-'
  );

  const handleSubmit = async (values, roomStatus) => {
    const apiResult = await axios.post('/api/booking/edit-room-booking-api', {
      ...values,
      status: roomStatus,
    });
    if (apiResult.data.success) router.reload();
  };

  const handleDirectBooking = async () => {
    localStorage.setItem(
      'selectedRoom',
      JSON.stringify({
        roomId: existingRecord.room_id,
        roomNumber: existingRecord.room_number,
      })
    );
    router.push('/guests');
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="xl"
      backdrop="static"
      keyboard="false">
      <Modal.Body>
        <h2 className="text-center">Create Reservation</h2>
        {existingRecord.status && (
          <div>
            <h4>Existing record detail</h4>
            <Row className="my-3">
              <Col xs={4} className="label">
                Status
              </Col>
              <Col xs={8} className="">
                {existingRecord.status}
              </Col>

              <Col xs={4} className="label mt-2">
                Notes
              </Col>
              <Col xs={8} className="mt-2">
                {existingRecord.notes.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Col>
            </Row>
          </div>
        )}
        <Formik
          initialValues={{
            checkInDate: selectedDate,
            checkOutDate: selectedDate,
            guestId: existingRecord?.guestId,
            userId: session.user.id,
            roomId: existingRecord.room_id,
            notes: '',
          }}
          validationSchema={validationRules}
          onSubmit={(values) => handleSubmit(values, 'provisioned')}>
          {(formik) => {
            const { values } = formik;
            return (
              <Form className="custom-form arrow-hidden">
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
                  <Col md={12} className="py-2">
                    <CustomTextArea
                      label="Notes"
                      name="notes"
                      placeholder="Any additional notes"
                    />
                  </Col>
                </Row>
                {/* Buttons */}
                <div className="center-flex">
                  <div className="mx-1">
                    <ReactiveButton
                      type={'submit'}
                      buttonState="idle"
                      size="small"
                      idleText={
                        <span className="fw-bold">Create Provision</span>
                      }
                      color="indigo"
                      className="rounded-1 bg-gradient"
                    />
                  </div>

                  {existingRecord.status && (
                    <div className="mx-1">
                      <ReactiveButton
                        buttonState="idle"
                        size="small"
                        idleText={
                          <span className="fw-bold">Release Provision</span>
                        }
                        color="yellow"
                        className="rounded-1 bg-gradient"
                        onClick={() => {
                          handleSubmit(values, '');
                        }}
                      />
                    </div>
                  )}

                  <div className="mx-1">
                    <ReactiveButton
                      buttonState="idle"
                      size="small"
                      idleText={<span className="fw-bold">Create Booking</span>}
                      color="green"
                      className="rounded-1 bg-gradient"
                      onClick={() => handleDirectBooking()}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default AddReservation;
