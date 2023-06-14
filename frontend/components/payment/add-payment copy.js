import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import PaymentForm from './payment-form';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';
import { addPaymentApi } from '@/api/visit-api';
import { Icon } from '../_commom/Icon';

function AddPayment({ show, setShow, visitId, setRefresh, session }) {
  const [paymentRecord, setPaymentRecord] = useState({
    paymentMethod: 'Cash',
    visitId: visitId,
    paymentReceiver: 'Check-out',
    userId: session.user.id,
  });
  const [submissionState, setSubmissionState] = useState('idle');

  const handleSubmit = async () => {
    if (!paymentRecord.paymentNotes) {
      setSubmissionState('error');
      setTimeout(() => {
        setSubmissionState('idle');
      }, 2000);
      return false;
    }
    setSubmissionState('loading');
    const apiResult = await addPaymentApi(paymentRecord);
    if (apiResult) {
      setSubmissionState('success');
      setPaymentRecord({
        paymentMethod: 'Cash',
        visitId: visitId,
        paymentReceiver: 'Check-out',
        userId: session.user.id,
      });
      setSubmissionState('idle');
      setRefresh(true);
      setShow(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      size="xl">
      <Modal.Header closeButton className="py-1">
        <h4>Please enter payment details</h4>
      </Modal.Header>
      <Modal.Body>
        <PaymentForm
          paymentRecord={paymentRecord}
          setPaymentRecord={setPaymentRecord}
        />

        <div className="d-flex justify-content-center mt-5 mb-3">
          <div className="mx-1">
            <ReactiveButton
              buttonState={submissionState}
              onClick={handleSubmit}
              color={'blue'}
              idleText={'Submit'}
              loadingText={
                <RiseLoader color="#ffffff" size={5} speedMultiplier={2} />
              }
              successText={
                <span className="d-flex justify-content-center">
                  <Icon nameIcon="FaRegThumbsUp" />
                </span>
              }
              errorText={<span className="text-danger">Enter Note</span>}
              type={'button'}
              className="rounded-1 bg-gradient"
              messageDuration={2000}
              animation={true}
            />
          </div>

          {submissionState === 'idle' ? (
            <div className="mx-1">
              <ReactiveButton
                buttonState="idle"
                onClick={() => {
                  setPaymentRecord({
                    paymentMethod: 'Cash',
                    visitId: visitId,
                    paymentReceiver: 'Check-out',
                    userId: session.user.id,
                  });
                  setShow(false);
                }}
                color={'red'}
                idleText={'Cancel'}
                type={'button'}
                className="rounded-1 bg-gradient"
                messageDuration={2000}
                animation={true}
              />
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddPayment;
