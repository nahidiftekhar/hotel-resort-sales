import {
  sumOfKey,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import React from 'react';
import { Row, Col } from 'react-bootstrap';

function BasicVisitData({ visitData }) {
  return (
    <Row className="gy-2 mt-3 mb-2 mx-0 border border-dark border-opacity-75">
      <Col md={6} xs={6}>
        <div className="fw-bold text-muted">Guest: </div>
        <p className="my-0">{visitData.guest?.name}</p>
        <p className="my-0">{visitData.guest?.phone}</p>
        <p className="my-0">{visitData.guest?.email}</p>
        <p className="my-0">{visitData.guest?.address}</p>
        <p className="my-0">
          {visitData.guest?.id_type}-{visitData.guest?.id_number}
        </p>
      </Col>

      <Col md={3} className="d-none d-md-block"></Col>

      <Col md={3} xs={6}>
        <p className="my-1">
          <span className="fw-bold text-muted">Assigned Room: </span>
          {visitData.room_number || '-'}
        </p>
        <p className="my-1">
          <span className="fw-bold text-muted">Check-in Date: </span>
          {visitData.checkin_date}
        </p>
        <p className="my-1">
          <span className="fw-bold text-muted">Check-out Date: </span>
          {visitData.checkout_date}
        </p>
      </Col>

      <Row className="mx-0 mt-2 p-0">
        <Col md={3} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Total Expense: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                sumOfKeyMultiply(
                  visitData.purchases,
                  'unit_price',
                  'item_count'
                ) || 0
              )}
            </span>
          </div>
        </Col>

        <Col md={3} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Total Payment: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                sumOfKey(visitData.paymentRecords, 'amount') || 0
              )}
            </span>
          </div>
        </Col>

        <Col md={3} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Adjustment: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                sumOfKey(visitData.adjustmentRecords, 'amount') * -1 || 0
              )}
            </span>
          </div>
        </Col>

        <Col md={3} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Receivable: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                (sumOfKeyMultiply(
                  visitData.purchases,
                  'unit_price',
                  'item_count'
                ) || 0) -
                  (sumOfKey(visitData.paymentRecords, 'amount') || 0) -
                  (sumOfKey(visitData.adjustmentRecords, 'amount') || 0)
              )}
            </span>
          </div>
        </Col>
      </Row>
    </Row>
  );
}

export default BasicVisitData;
