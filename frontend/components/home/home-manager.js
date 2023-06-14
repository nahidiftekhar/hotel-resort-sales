import React, { useEffect, useState } from 'react';
import UpcomingBooking from './report-components/upcoming-bookings';
import ExistingGuests from './report-components/existing-guests';
import SalesPerformance from './report-components/sales-performance';
import DaywiseCount from './report-components/daywise-count';
import { Col, Row } from 'react-bootstrap';
import FinancialsTotal from './report-components/financials-total';

function HomeManager({ session }) {
  return (
    <Row>
      <Col md={5}>
        <div className="min-vh-100 center-flex flex-column sticky-top d-none d-md-flex">
          <DaywiseCount />
          <FinancialsTotal />
        </div>
        <div className="d-md-none">
          <DaywiseCount />
          <FinancialsTotal />
        </div>
      </Col>
      <Col md={7}>
        <UpcomingBooking session={session} />
        <ExistingGuests session={session} />
        <SalesPerformance />
      </Col>
    </Row>
  );
}

export default HomeManager;
