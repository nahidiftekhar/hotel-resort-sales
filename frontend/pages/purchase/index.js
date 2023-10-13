import Link from 'next/link';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

const PurchaseHome = () => {
  return (
    <div className="min-vh-50 center-flex">
      <Row className="text-center">
        <Col md={12} className="my-3">
          <Link href="/purchase/item-requisition">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Store Requisition"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col>
        <Col md={12} className="my-3">
          <Link href="/purchase/item-purchase">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Purchase Requisition"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col>
        <Col md={12} className="my-3">
          <Link href="/purchase/new-item">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="New Item"
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
      </Row>
    </div>
  );
};

export default PurchaseHome;
