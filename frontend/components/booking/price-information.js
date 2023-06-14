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
          bookingDetails?.price_components
            ? Object.values(bookingDetails?.price_components).reduce(
                (accumulator, { rackPrice }) => accumulator + Number(rackPrice),
                0
              ) || 0
            : 0
        )}
      </Col>

      <Col xs={6} md={9} className="text-muted text-md-end">
        Discount Amount
      </Col>
      <Col xs={6} md={3} className="">
        {BDTFormat.format(
          (bookingDetails?.price_components
            ? Object.values(bookingDetails?.price_components).reduce(
                (accumulator, { rackPrice }) => accumulator + Number(rackPrice),
                0
              ) || 0
            : 0) -
            (bookingDetails?.price_components
              ? Object.values(bookingDetails?.price_components).reduce(
                  (accumulator, { priceAfterDiscount }) =>
                    accumulator + Number(priceAfterDiscount),
                  0
                ) || 0
              : 0)
        )}
      </Col>

      <Col xs={6} md={9} className="text-muted text-md-end">
        Price After Discount
      </Col>
      <Col xs={6} md={3} className="">
        {BDTFormat.format(
          bookingDetails?.price_components
            ? Object.values(bookingDetails?.price_components).reduce(
                (accumulator, { priceAfterDiscount }) =>
                  accumulator + Number(priceAfterDiscount),
                0
              ) || 0
            : 0
        )}
      </Col>

      <Col xs={6} md={9} className="text-muted text-md-end">
        Booking Status
      </Col>
      <Col xs={6} md={3} className="">
        {camelCaseToCapitalizedString(bookingDetails?.booking_status || '-')}
      </Col>

      {(discountDetails.discount_notes || discountDetails.approval_notes) && (
        <>
          <Col xs={6} md={9} className="text-muted text-md-end">
            Discount Notes
          </Col>
          <Col xs={6} md={3} className="">
            <p className="my-0">
              <strong>Requester: </strong>
              {discountDetails.discount_notes}
            </p>
            <p className="my-0">
              <strong>Approver: </strong>
              {discountDetails.approval_notes}
            </p>
          </Col>
        </>
      )}
    </Row>
  );
}

export default PriceInformation;
