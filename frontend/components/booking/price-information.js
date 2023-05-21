import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { BDTFormat } from '@/components/_functions/number-format';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';

function PriceInformation({ bookingDetails, discountDetails }) {
  return (
    <Row className="border border-grey m-0 pb-2">
      <div className="separator-hr" />
      <Col xs={6} md={9} className="text-muted text-md-end">
        Total Price
      </Col>
      <Col xs={6} md={3} className="">
        {BDTFormat.format(
          Object.values(bookingDetails?.price_components).reduce(
            (accumulator, { rackPrice }) => accumulator + rackPrice,
            0
          ) || 0
        )}
      </Col>

      <Col xs={6} md={9} className="text-muted text-md-end">
        Discount Amount
      </Col>
      <Col xs={6} md={3} className="">
        {BDTFormat.format(
          Object.values(bookingDetails?.price_components).reduce(
            (accumulator, { discount }) => accumulator + discount,
            0
          ) || 0
        )}
      </Col>

      <Col xs={6} md={9} className="text-muted text-md-end">
        Discount Status
      </Col>
      <Col xs={6} md={3} className="">
        {camelCaseToCapitalizedString(discountDetails?.approval_status || '-')}
      </Col>

      <Col xs={6} md={9} className="text-muted text-md-end">
        Price After Discount
      </Col>
      <Col xs={6} md={3} className="">
        {BDTFormat.format(
          Object.values(bookingDetails?.price_components).reduce(
            (accumulator, { priceAfterDiscount }) =>
              accumulator + priceAfterDiscount,
            0
          ) || 0
        )}
      </Col>
    </Row>
  );
}

export default PriceInformation;
