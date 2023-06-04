import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { BDTFormat } from '@/components/_functions/number-format';
import { sumOfKeyMultiply } from '@/components/_functions/common-functions';

function ExpenseRecord({ visitData }) {
  return (
    <>
      <div className="p-2 mt-1 border border-bottom-0 border-dark border-opacity-75 d-flex justify-content-between fw-bold bg-light">
        <span className="me-5">Total cost of service</span>
        <span>
          {BDTFormat.format(
            sumOfKeyMultiply(visitData.purchases, 'unit_price', 'item_count') ||
              0
          )}
        </span>
      </div>
      <div className="p-2 border border-top-0 border-dark border-opacity-75">
        <Row>
          <Col md={6}>
            <div className="font-small d-flex justify-content-between">
              <span className="text-muted me-5">Booking expense:</span>
              <span className="">
                {BDTFormat.format(
                  sumOfKeyMultiply(
                    visitData.purchases.filter(
                      (item) => item.item_type === 'Booking'
                    ),
                    'unit_price',
                    'item_count'
                  ) || 0
                )}
              </span>
            </div>
          </Col>
          <Col md={6} className="d-none d-md-block"></Col>
          <Col md={6}>
            <div className="font-small d-flex justify-content-between">
              <span className="text-muted me-5">Purchase expense:</span>
              <span className="">
                {BDTFormat.format(
                  sumOfKeyMultiply(
                    visitData.purchases.filter(
                      (item) => item.item_type !== 'Booking'
                    ),
                    'unit_price',
                    'item_count'
                  )
                )}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ExpenseRecord;
