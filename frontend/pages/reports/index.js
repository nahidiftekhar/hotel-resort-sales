import Link from 'next/link';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

const PurchaseHome = () => {
  return (
    <div className="min-vh-50 center-flex">
      <Row className="w-100 text-center">
        <Col md={12} className="my-3">
          <Link href="/reports/revenue-expense">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Revenue & Expense Report"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col>
        <Col md={12} className="my-3">
          <Link href="/purchase/stock-status">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Stock Status"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col>
        <Col md={12} className="my-3">
          <Link href="/reports/daily-stock">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Items Report"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col>
        <Col md={12} className="my-3">
          <Link href="/reports/inventory-report">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Inventory Report"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseHome;
