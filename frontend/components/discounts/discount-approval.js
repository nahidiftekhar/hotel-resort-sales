import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { approveDiscountApi } from '@/api/booking-api';
import { camelCaseToCapitalizedString } from '../_functions/string-format';

function DiscountApproval({
  show,
  setShow,
  discountData,
  setReferesh,
  session,
}) {
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUserId(session.user.id);
  }, [session.user.id]);

  const handleSubmit = async (approvalStatus) => {
    if (!notes && !approvalStatus) {
      setErrorMessage('Please include appropriate notes.');
      return false;
    }

    const apiResult = await approveDiscountApi(
      discountData,
      approvalStatus,
      notes,
      userId
    );
    if (apiResult.modifyBooking?.success) {
      setReferesh(true);
      setShow(false);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} backdrop="static">
      <Modal.Header>
        <Modal.Title>Discount Approval</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="custom-form">
          <div className="d-flex justify-content-between bg-light rounded px-2 py-1 my-2">
            <p className="my-0">Price before discont (BDT) </p>
            <p className="my-0 fw-bold">
              {Number(discountData.amount).toFixed(2)}
            </p>
          </div>
          <div className="d-flex justify-content-between bg-light rounded px-2 py-1 my-2">
            <p className="my-0">Discont percentage (%) </p>
            <p className="my-0 fw-bold">
              {Number(discountData.percentage_value).toFixed()} %
            </p>
          </div>
          <div className="d-flex justify-content-between bg-light rounded px-2 py-1 my-2">
            <p className="my-0">Price after discont (BDT) </p>
            <p className="my-0 fw-bold">
              {Number(discountData.discountedAmount).toFixed(2)}
            </p>
          </div>
          <div className="d-flex justify-content-between bg-light rounded px-2 py-1 my-2">
            <p className="my-0">Approval Status </p>
            <p className="my-0">
              {camelCaseToCapitalizedString(discountData.approval_status)}
            </p>
          </div>
          {discountData.approver_id === userId && (
            <textarea
              name="newNotes"
              disabled={discountData.approver_id !== userId}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        {discountData.approver_id === userId ? (
          <div className="d-flex justify-content-end mt-3">
            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Close"
                color="yellow"
                size="tiny"
                rounded
                onClick={() => setShow(false)}
                className="bg-gradient fw-bold"
              />
            </div>

            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Approve"
                color="green"
                size="tiny"
                rounded
                onClick={() => handleSubmit(true)}
                className="bg-gradient fw-bold"
              />
            </div>

            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Reject"
                color="red"
                size="tiny"
                rounded
                onClick={() => handleSubmit(false)}
                className="bg-gradient fw-bold"
              />
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-end mt-3">
            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Close"
                color="yellow"
                size="tiny"
                rounded
                onClick={() => setShow(false)}
                className="bg-gradient fw-bold"
              />
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default DiscountApproval;
