import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { BDTFormat } from '@/components/_functions/number-format';
import { sumOfKey } from '@/components/_functions/common-functions';
import { datetimeStringToDateTime } from '@/components/_functions/string-format';

function AdjustmentRecord({ visitData }) {
  return (
    <>
      <div className="p-2 mt-1 border border-bottom-0 border-dark border-opacity-75 d-flex justify-content-between fw-bold bg-light">
        <span className="me-5">Adjustment Records</span>
        <span>
          {BDTFormat.format(
            sumOfKey(visitData.adjustmentRecords, 'amount') * -1 || 0
          )}
        </span>
      </div>
      <div className="p-2 border border-top-0  border-dark border-opacity-75 font-small">
        <Row className="fw-bold font-small border-bottom mb-1">
          <Col xs={3}>Section</Col>
          <Col xs={3}>Notes</Col>
          <Col xs={3} className="text-end">
            Time
          </Col>
          <Col xs={3} className="text-end">
            Amount
          </Col>
        </Row>
        {visitData.adjustmentRecords?.map((payment, index) => (
          <Row key={index}>
            <Col xs={3}>{payment.payment_receiver || 'Cash counter'}</Col>
            <Col xs={3}>{payment.payment_notes}</Col>
            <Col xs={3} className="text-end">
              {datetimeStringToDateTime(payment.createdAt)}
            </Col>
            <Col xs={3} className="text-end">
              {BDTFormat.format(payment.amount * -1)}
            </Col>
          </Row>
        ))}
      </div>
    </>
  );
}

export default AdjustmentRecord;
