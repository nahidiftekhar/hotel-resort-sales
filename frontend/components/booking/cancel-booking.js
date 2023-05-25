import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { cancelBookingApi, confirmAdvancedApi } from '@/api/booking-api';
import { readFromStorage } from '@/components/_functions/storage-variable-management';

function CancelBooking({ show, setShow, bookingData, setReferesh }) {
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUserId(readFromStorage('USER_KEY'));
  }, []);

  const handleSubmit = async () => {
    if (!notes) {
      setErrorMessage('Please enter notes for cancellation');
      return false;
    }
    const cancellationNotes =
      bookingData.booking_notes +
      '\n\nDate: ' +
      new Date() +
      '\n' +
      'User ID: ' +
      userId +
      '\nNote: ' +
      notes;

    const apiResult = await cancelBookingApi(bookingData.id, cancellationNotes);
    if (apiResult.success) {
      setReferesh(true);
      setErrorMessage('');
      setShow(false);
    } else {
      setErrorMessage('Something went wrong.');
      return false;
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}>
      <Modal.Body>
        <h5 className="text-danger">
          Are you sure you want to cancel booking {bookingData.id}?
        </h5>
        <div className="custom-form arrow-hidden">
          <label for="newNotes" className="mt-3">
            Notes for Cancellation
          </label>
          <textarea
            name="newNotes"
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText="Cancel Booking"
              size="small"
              color="red"
              outline
              onClick={handleSubmit}
            />
          </div>
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText="Close"
              size="small"
              color="yellow"
              outline
              onClick={() => {
                setShow(false);
                setErrorMessage('');
              }}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CancelBooking;
