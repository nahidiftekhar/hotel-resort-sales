import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { confirmAdvancedApi } from '@/api/booking-api';
import { readFromStorage } from '@/components/_functions/storage-variable-management';

function AdvancedCreations({ show, setShow, bookingData, setReferesh }) {
  const [notes, setNotes] = useState('');
  const [advancedAmount, setAdvancedAmount] = useState(0);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    setUserId(readFromStorage('USER_KEY'));
    setAdvancedAmount(bookingData.advanced_amount);
  }, [bookingData]);

  const handleSubmit = async () => {
    const advancedNotes =
      bookingData.advanced_notes +
      '\n\nDate: ' +
      new Date() +
      '\n' +
      'User ID: ' +
      userId +
      '\nNote: ' +
      notes;
    if (advancedAmount > Number(bookingData.discounted_amount)) return false;
    const apiResult = await confirmAdvancedApi({
      bookingId: bookingData.id,
      advancedAmount,
      advancedNotes,
    });
    if (apiResult.success) {
      setReferesh(true);
      setShow(false);
    } else return false;
  };
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}>
      <Modal.Header>
        <Modal.Title>Advanced Payment Records</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="custom-form">
          <div className="d-flex justify-content-between bg-light rounded px-2 py-1 my-2">
            <p className="my-0">Price after discont (BDT) </p>
            <p className="my-0 fw-bold">
              {Number(bookingData.discounted_amount).toFixed(2)}
            </p>
          </div>
          <label for="amount">Advance amount (BDT)</label>
          <input
            type="number"
            name="amount"
            value={advancedAmount}
            min={0}
            max={Number(bookingData.discounted_amount).toFixed(2)}
            onChange={(e) => setAdvancedAmount(e.target.value)}
          />

          <label for="newNotes" className="mt-3">
            Existing Notes
          </label>
          <textarea
            name="newNotes"
            rows={4}
            disabled
            value={bookingData.advanced_notes}
          />

          <label for="newNotes" className="mt-3">
            Additional Notes
          </label>
          <textarea
            name="newNotes"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center mt-3">
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText="Submit"
              size="small"
              color="blue"
              outline
              onClick={handleSubmit}
            />
          </div>
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText="Cancel"
              size="small"
              color="red"
              outline
              onClick={() => setShow(false)}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AdvancedCreations;
