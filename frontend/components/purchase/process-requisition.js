import React, { useState, useEffect } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { datetimeStringToDate } from '../_functions/string-format';
import ReactiveButton from 'reactive-button';
import axios from 'axios';

const ProcessRequisition = ({
  openProcessModal,
  setOpenProcessModal,
  currentItem,
  user,
  setRefresh,
}) => {
  const [deliveredQuantity, setDeliveredQuantity] = useState(
    Number(currentItem?.quantity) || 0
  );
  const [fullfillmentNotes, setFullfillmentNotes] = useState('');

  useEffect(() => {
    setDeliveredQuantity(Number(currentItem?.quantity) || 0);
    setFullfillmentNotes('');
  }, [currentItem]);

  const handleProcess = async (status) => {
    const quantityNote =
      Number(currentItem.quantity) !== deliveredQuantity &&
      status === 'fullfilled'
        ? `Quantity changed from ${Number(
            currentItem.quantity
          )} to ${deliveredQuantity} \n`
        : '';

    if (!deliveredQuantity) {
      return alert('Please enter delivered quantity');
    }

    if (status === 'rejected' && !fullfillmentNotes) {
      return alert('Please enter fullfillment notes');
    }

    const processResult = await axios.post('/api/purchase/requisitions/edit', {
      id: currentItem.id,
      status,
      quantity: deliveredQuantity,
      notes: quantityNote + fullfillmentNotes,
      approverId: user.id,
      usertypeId: user.usertype,
      productId: currentItem.product_id,
    });
    if (processResult.data.success) {
      alert('Requisition processed successfully');
      setOpenProcessModal(false);
      setRefresh(true);
    } else {
      alert(processResult.data.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      show={openProcessModal}
      onHide={() => {
        setOpenProcessModal(false);
        setFullfillmentNotes('');
        setDeliveredQuantity(0);
      }}
      size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Process Item Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={6}>
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
          <Col md={4} xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Requester</p>
              <p className="my-0 fw-bold">
                {currentItem?.requisition_requester?.username}
              </p>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="my-2">
              <p className="my-0 label-text">Requester Department</p>
              <p className="my-0 fw-bold">
                {currentItem?.requisition_requester?.usertype?.user_type}
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
              <p className="my-0">{currentItem?.notes}</p>
            </div>
          </Col>
          <div className="separator-hr" />
          {currentItem.status === 'pending' && (
            <Col md={12}>
              <div className="my-2 custom-form arrow-hidden">
                <p className="my-0 label-text">
                  Delivered Quantity ({currentItem?.product?.unit})
                </p>
                <input
                  className="form-control"
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Enter quantity here"
                  value={deliveredQuantity}
                  onChange={(e) => setDeliveredQuantity(e.target.value)}
                />
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
            </Col>
          )}

          {currentItem.status === 'pending' && (
            <Col md={12}>
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
                  idleText="Complete"
                  onClick={() => {
                    handleProcess('fullfilled');
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProcessRequisition;
