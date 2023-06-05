import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { paymentOptions, paymentReceivers } from '@/data/paymentOptions';

function PaymentForm({ paymentRecord, setPaymentRecord }) {
  return (
    <Row className="mx-0 my-1 py-2 custom-form arrow-hidden">
      <Col xs={6} md={9} className="fw-bold">
        Payment amount (BDT)
      </Col>
      <Col xs={6} md={2} className="fw-bold text-end">
        <input
          // type="number"
          // step=".01"
          type="text"
          pattern="^\d*(\.\d{0,2})?$"
          // min={0}
          value={paymentRecord.amount || 0}
          onChange={(e) =>
            setPaymentRecord({ ...paymentRecord, amount: e.target.value })
          }
        />
      </Col>

      {paymentRecord.amount > 0 ? (
        <>
          <Col xs={6} md={4}>
            <label for="paymentMethod" className="mt-3">
              Payment Method
            </label>
            <select
              name="paymentoption"
              id="paymentoption"
              onChange={(e) =>
                setPaymentRecord({
                  ...paymentRecord,
                  paymentMethod: e.target.value,
                })
              }>
              {paymentOptions.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </Col>

          <Col xs={6} md={4}>
            <label for="paymentMethod" className="mt-3">
              Received by
            </label>
            <select
              name="paymentreceiver"
              id="paymentreceiver"
              onChange={(e) =>
                setPaymentRecord({
                  ...paymentRecord,
                  paymentReceiver: e.target.value,
                })
              }>
              {paymentReceivers.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </Col>

          <Col md={4}>
            <label for="paymentNotes" className="mt-3">
              Payment Notes
            </label>
            <textarea
              rows={1}
              placeholder="Transaction reference"
              name="paymentNotes"
              id="paymentNotes"
              onChange={(e) =>
                setPaymentRecord({
                  ...paymentRecord,
                  paymentNotes: e.target.value,
                })
              }
            />
          </Col>
        </>
      ) : (
        ''
      )}
    </Row>
  );
}

export default PaymentForm;
