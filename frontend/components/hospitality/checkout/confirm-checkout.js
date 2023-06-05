import React, { useState } from 'react';
import { Modal, Row, Col, Form } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';

import { Icon } from '@/components/_commom/Icon';
import BasicVisitData from '../view-visit/basic-visitdata';
import {
  sumOfKey,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import { checkoutApi } from '@/api/visit-api';

function ConfirmCheckout({ show, setShow, visitData, setRefresh, session }) {
  const [checkoutRecord, setCheckoutRecord] = useState({
    id: visitData.id,
    expense:
      sumOfKeyMultiply(visitData.purchases, 'unit_price', 'item_count') || 0,
    payment: sumOfKey(visitData.paymentRecords, 'amount') || 0,
    adjustment: sumOfKey(visitData.adjustmentRecords, 'amount') * -1 || 0,
    checkoutDate: new Date(),
    visitNotes:
      visitData.visit_notes + '\nCheck-out by userid: ' + session.user.id,
  });
  const [submissionState, setSubmissionState] = useState('idle');

  const handleSubmit = async () => {
    if (checkoutRecord.duesCleared !== 'Yes' && !checkoutRecord.duesNotes) {
      setSubmissionState('error');
      setTimeout(() => {
        setSubmissionState('idle');
      }, 2000);
      return false;
    }

    if (checkoutRecord.keysCleared !== 'Yes' && !checkoutRecord.keysNotes) {
      setSubmissionState('error');
      setTimeout(() => {
        setSubmissionState('idle');
      }, 2000);
      return false;
    }

    if (checkoutRecord.roomCleared !== 'Yes' && !checkoutRecord.roomNotes) {
      setSubmissionState('error');
      setTimeout(() => {
        setSubmissionState('idle');
      }, 2000);
      return false;
    }

    setSubmissionState('loading');

    let modifiedNotes = checkoutRecord.visitNotes + '\nDues Notes: \n';
    modifiedNotes +=
      checkoutRecord.duesCleared === 'Yes'
        ? 'Cleared'
        : checkoutRecord.duesNotes;
    modifiedNotes += '\nRoom Notes: \n';
    modifiedNotes +=
      checkoutRecord.roomCleared === 'Yes'
        ? 'Cleared'
        : checkoutRecord.roomNotes;
    modifiedNotes += '\nKeys Notes: \n';
    modifiedNotes +=
      checkoutRecord.keysCleared === 'Yes'
        ? 'Cleared'
        : checkoutRecord.keysNotes;

    const checkoutRecordFinal = {
      ...checkoutRecord,
      visitNotes: modifiedNotes,
    };
    const apiResult = await checkoutApi(checkoutRecordFinal);

    if (apiResult.success) {
      setSubmissionState('success');
      setSubmissionState('idle');
      setRefresh(true);
      setShow(false);
    } else {
      setSubmissionState('error');
      setTimeout(() => {
        setSubmissionState('idle');
      }, 2000);
      return false;
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
        <h4>Please confirm check-out information</h4>
      </Modal.Header>
      <Modal.Body>
        <BasicVisitData visitData={visitData} />

        <Row className="my-3">
          <Form className="custom-form">
            <Col md={6}>
              <div className="d-flex justify-content-between checkout-form">
                <span className="fs-6 me-2">
                  Has the guest cleared all dues?
                </span>
                <div className="me-md-3">
                  <Form.Check
                    inline
                    label="Yes"
                    name="group1"
                    type="radio"
                    id={`inline-pay-2`}
                    className="text-dark"
                    onChange={() =>
                      setCheckoutRecord({
                        ...checkoutRecord,
                        duesCleared: 'Yes',
                      })
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="group1"
                    type="radio"
                    id={`inline-pay-2`}
                    className="text-dark"
                    onChange={() =>
                      setCheckoutRecord({
                        ...checkoutRecord,
                        duesCleared: 'No',
                      })
                    }
                  />
                </div>
              </div>
            </Col>

            {checkoutRecord.duesCleared === 'No' && (
              <Col md={6}>
                <label>Justification</label>
                <textarea
                  name="dueNotes"
                  onChange={(e) =>
                    setCheckoutRecord({
                      ...checkoutRecord,
                      duesNotes: e.target.value,
                    })
                  }
                />
              </Col>
            )}

            <div className="my-3" />

            <Col md={6}>
              <div className="d-flex justify-content-between checkout-form">
                <span className="fs-6 me-2">
                  Has the guest submitted room keys?
                </span>
                <div className="me-md-3">
                  <Form.Check
                    inline
                    label="Yes"
                    name="group2"
                    type="radio"
                    id={`inline-pay-2`}
                    className="text-dark"
                    onChange={() =>
                      setCheckoutRecord({
                        ...checkoutRecord,
                        keysCleared: 'Yes',
                      })
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="group2"
                    type="radio"
                    id={`inline-pay-2`}
                    className="text-dark"
                    onChange={() =>
                      setCheckoutRecord({
                        ...checkoutRecord,
                        keysCleared: 'No',
                      })
                    }
                  />
                </div>
              </div>
            </Col>

            {checkoutRecord.keysCleared === 'No' && (
              <Col md={6}>
                <label>Justification</label>
                <textarea
                  name="dueNotes"
                  onChange={(e) =>
                    setCheckoutRecord({
                      ...checkoutRecord,
                      keysNotes: e.target.value,
                    })
                  }
                />
              </Col>
            )}

            <div className="my-3" />

            <Col md={6}>
              <div className="d-flex justify-content-between checkout-form">
                <span className="fs-6 me-2">
                  Is the room found is acceptable condition?
                </span>
                <div className="me-md-3">
                  <Form.Check
                    inline
                    label="Yes"
                    name="group3"
                    type="radio"
                    id={`inline-pay-2`}
                    className="text-dark"
                    onChange={() =>
                      setCheckoutRecord({
                        ...checkoutRecord,
                        roomCleared: 'Yes',
                      })
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="group3"
                    type="radio"
                    id={`inline-pay-2`}
                    className="text-dark"
                    onChange={() =>
                      setCheckoutRecord({
                        ...checkoutRecord,
                        roomCleared: 'No',
                      })
                    }
                  />
                </div>
              </div>
            </Col>

            {checkoutRecord.roomCleared === 'No' && (
              <Col md={6}>
                <label>Justification</label>
                <textarea
                  name="dueNotes"
                  onChange={(e) =>
                    setCheckoutRecord({
                      ...checkoutRecord,
                      roomNotes: e.target.value,
                    })
                  }
                />
              </Col>
            )}
          </Form>
        </Row>

        <div className="center-flex mt-4">
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
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmCheckout;
