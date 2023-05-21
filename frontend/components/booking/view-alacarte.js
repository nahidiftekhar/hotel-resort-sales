import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { BDTFormat } from '@/components/_functions/number-format';

function ViewAlacarte({ selectedProducts, priceDetails }) {
  return (
    <Row className="border border-grey m-0 py-2">
      <h4 className="mb-3 bg-light">À la carte Items</h4>
      <Col sm={6}>
        {selectedProducts.map((singlePackage, index) => (
          <div key={index} className="border-top">
            <div>{singlePackage.name}</div>
            <div className="font-small">
              <span className="text-muted">Portions</span>
              <span className="ms-2">{singlePackage.alacarte_count}</span>
            </div>
            <div className="font-small">
              <span className="me-2">
                {BDTFormat.format(singlePackage.alacarte_cost || 0)}
              </span>
            </div>
          </div>
        ))}
      </Col>

      <Col sm={6} className="my-3 my-md-0 font-small d-flex align-items-center">
        <Row>
          <Col xs={6}>Rack Rate</Col>
          <Col xs={6}>{BDTFormat.format(priceDetails.rackPrice)}</Col>

          <Col xs={6}>Discount Amount</Col>
          <Col xs={6}>{BDTFormat.format(priceDetails.discount)}</Col>

          <Col xs={6}>Discount Percentage</Col>
          <Col xs={6}>
            {((priceDetails.discount * 100) / priceDetails.rackPrice).toFixed(
              2
            )}
            %
          </Col>

          {priceDetails.discount > 0 && <Col xs={6}>Discount Notes</Col>}
          {priceDetails.discount > 0 && (
            <Col xs={6}>{priceDetails.discountNotes}</Col>
          )}

          <Col xs={6}>Price After Discount</Col>
          <Col xs={6}>{BDTFormat.format(priceDetails.priceAfterDiscount)}</Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ViewAlacarte;
