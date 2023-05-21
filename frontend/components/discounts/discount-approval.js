import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { approveDiscountApi } from '@/api/booking-api';
import { readFromStorage } from '@/components/_functions/storage-variable-management';

function DiscountApproval({ show, setShow, discountData, setReferesh }) {
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    setUserId(readFromStorage('USER_KEY'));
  }, []);

  const handleSubmit = async (approvalStatus) => {
    const apiResult = await approveDiscountApi({
      ...discountData,
      approvalStatus,
      notes,
    });
    if (apiResult.modifyBooking.success) {
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
            <p className="my-0">{discountData.approval_status}</p>
          </div>
          <textarea
            name="newNotes"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {discountData.approver_id === userId ? (
          <div className="d-flex justify-content-end mt-3">
            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Close"
                color="yellow"
                size="tiny"
                outline
                rounded
                onClick={() => setShow(false)}
                className=""
              />
            </div>

            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Approve"
                color="green"
                size="tiny"
                outline
                rounded
                onClick={() => handleSubmit(true)}
              />
            </div>

            <div className="mx-2">
              <ReactiveButton
                buttonState="idle"
                idleText="Reject"
                color="red"
                size="tiny"
                outline
                rounded
                onClick={() => handleSubmit(false)}
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
                outline
                rounded
                onClick={() => setShow(false)}
                className=""
              />
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default DiscountApproval;
