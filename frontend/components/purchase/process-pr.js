import React, { useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { datetimeStringToDate } from '../_functions/string-format';
import ReactiveButton from 'reactive-button';
import axios from 'axios';

const ProcessPr = ({
  openProcessModal,
  setOpenProcessModal,
  currentItem,
  user,
  setRefresh,
}) => {
  const [actualCost, setActualCost] = useState(Number(currentItem.price) || 0);
  const [fullfillmentNotes, setFullfillmentNotes] = useState('');

  const handleProcess = async (status) => {
    if (status === 'rejected' && !fullfillmentNotes) {
      return alert('Please enter notes');
    }

    const processResult = await axios.post('/api/purchase/pr/edit', {
      id: currentItem.id,
      status,
      notes: currentItem.notes + '\n' + fullfillmentNotes,
      userId: user.id,
      usertypeId: user.usertype,
      cost: actualCost,
    });
    if (processResult.data.success) {
      alert('PR processed successfully');
      setOpenProcessModal(false);
      setRefresh(true);
    } else {
      alert(processResult.data.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      show={openProcessModal}
      onHide={() => setOpenProcessModal(false)}
      size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Process Purchase Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <div className="my-2">
              <p className="my-0 label-text">Item Name</p>
              <p className="my-0 fw-bold">{currentItem?.product?.name}</p>
            </div>
          </Col>
          <Col xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Quantity Requested</p>
              <p className="my-0 fw-bold">
                {currentItem.quantity} {currentItem?.product?.unit}
              </p>
            </div>
          </Col>
          <Col xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Price</p>
              <p className="my-0 fw-bold">{currentItem.price} BDT</p>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Requester</p>
              <p className="my-0 fw-bold">
                {currentItem?.purchase_requester?.username}
              </p>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Requester Department</p>
              <p className="my-0 fw-bold">
                {currentItem?.purchase_requester?.usertype?.user_type}
              </p>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Request Date</p>
              <p className="my-0 fw-bold">
                {datetimeStringToDate(currentItem?.createdAt)}
              </p>
            </div>
          </Col>
          <Col md={12} xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Notes</p>
              <p className="my-0">
                {currentItem.notes
                  ? currentItem.notes.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line === 'null' ? '-' : line}
                        <br />
                      </React.Fragment>
                    ))
                  : '-'}
              </p>
            </div>
          </Col>
          <div className="separator-hr" />
          <Col md={12}>
            {['pendingApproval'].includes(currentItem.status) && (
              <div className="my-2 custom-form arrow-hidden">
                <p className="mt-3 my-0 label-text">Fullfillment Notes</p>
                <textarea
                  className="form-control"
                  name="notes"
                  id="notes"
                  rows="2"
                  placeholder="Enter notes here"
                  value={fullfillmentNotes}
                  onChange={(e) => setFullfillmentNotes(e.target.value)}
                />
              </div>
            )}

            {['released'].includes(currentItem.status) && (
              <div className="my-2 custom-form arrow-hidden">
                <p className="mt-3 my-0 label-text">Actual Cost</p>
                <input
                  className="form-control"
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Enter actual cost"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                />
              </div>
            )}
          </Col>

          <Col md={12}>
            {currentItem.status === 'pendingApproval' && (
              <div className="my-4 d-flex justify-content-between">
                <ReactiveButton
                  color="yellow"
                  idleText="Reject"
                  onClick={() => {
                    handleProcess('rejected');
                  }}
                />

                <ReactiveButton
                  color="green"
                  idleText="Approve"
                  onClick={() => {
                    handleProcess('approved');
                  }}
                />
              </div>
            )}

            {currentItem.status === 'approved' && (
              <div className="my-4 d-flex justify-content-center">
                <ReactiveButton
                  color="green"
                  idleText="Budget Released"
                  onClick={() => {
                    handleProcess('released');
                  }}
                />
              </div>
            )}

            {currentItem.status === 'released' && (
              <div className="my-4 d-flex justify-content-center">
                <ReactiveButton
                  color="green"
                  idleText="Purchase Complete"
                  onClick={() => {
                    handleProcess('purchased');
                  }}
                />
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProcessPr;
