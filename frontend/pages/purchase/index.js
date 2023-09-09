import Link from 'next/link';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

const PurchaseHome = () => {
  return (
    <div className="min-vh-50 center-flex">
      <Row className="w-100 text-center">
        <Col md={12} className="my-3">
          <Link href="/purchase/item-requisition">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Item Requisition"
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
        {/* <Col md={6} className="my-3">
          <Link href="/purchase/item-list">
            <ReactiveButton
              buttonState="idle"
              color="indigo"
              idleText="Item List"
              size="large"
              className="w-300px"
            />
          </Link>
        </Col> */}
      </Row>
    </div>
  );
};

export default PurchaseHome;
