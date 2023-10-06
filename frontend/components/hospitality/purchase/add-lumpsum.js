import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { addPurchaseApi } from '@/api/visit-api';

function AddLumpSum({ componentType, visitId, setRefresh, setShow, session }) {
  const [paymentRecord, setPaymentRecord] = useState({
    paymentMethod: 'Cash',
    visitId: visitId,
    paymentReceiver: 'Front Desk',
    userId: session.user.id,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const purchases = [
      {
        item_type: event.target.item_type.value,
        item_name: event.target.item_name.value,
        item_count: Number(event.target.item_count.value),
        unit_price: Number(event.target.unit_price.value),
        visit_id: visitId,
        user_id: session.user.id,
      },
    ];
    const apiResult = await addPurchaseApi(purchases, paymentRecord);
    setRefresh(true);
    setShow(false);
  };

  return (
    <div>
      {/* Dropdown element for all items */}
      <div className="border-bottom border-3 mt-4" />

      <form className="custom-form" onSubmit={handleSubmit}>
        <Row className="custom-form arrow-hidden  mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
          <Col xs={12} md={8} className="">
            <label>Item Name</label>
            <input type="text" name="item_name" placeholder="Item Name" />
          </Col>
          <input type="hidden" name="item_count" value={1} />
          <input type="hidden" name="item_type" value={componentType} />
          <Col xs={12} md={4} className="">
            <label>Price</label>
            <input type="number" name="unit_price" placeholder="Price" />
          </Col>
        </Row>

        <div className="center-flex mt-3">
          <ReactiveButton type="submit" buttonState="idle" idleText="Submit" />
        </div>
      </form>
    </div>
  );
}

export default AddLumpSum;
