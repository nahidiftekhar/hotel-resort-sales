import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { BDTFormat } from '@/components/_functions/number-format';
import { dateStringToMONDD } from '../_functions/date-functions';

function ViewVenues({ selectedProducts, priceDetails }) {
  return (
    <Row className="border border-grey m-0 py-2">
      <h4 className="mb-3 bg-light">Venues</h4>
      <Col sm={6}>
        {selectedProducts.map((singlePackage, index) => (
          <div key={index} className="border-top">
            <div>{singlePackage.venue_name}</div>
            <div className="font-small">
              <span className="text-muted">
                {dateStringToMONDD(singlePackage.checkInDate)} -{' '}
                {dateStringToMONDD(singlePackage.checkOutDate)}
              </span>
            </div>
            <div className="font-small">
              <span className="me-2">
                {BDTFormat.format(singlePackage.venue_cost || 0)}
              </span>
            </div>
          </div>
        ))}
      </Col>

      <Col sm={6} className="my-3 my-md-0 font-small">
        <Row>
          <Col xs={6}>Rack Rate</Col>
          <Col xs={6}>{BDTFormat.format(priceDetails.rackPrice)}</Col>

          <Col xs={6}>Discount Amount</Col>
          <Col xs={6}>
            {BDTFormat.format(
              priceDetails.rackPrice - priceDetails.priceAfterDiscount
            )}
          </Col>

          <Col xs={6}>Discount Percentage</Col>
          <Col xs={6}>{priceDetails.discount}%</Col>

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

export default ViewVenues;
