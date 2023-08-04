import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllServicesApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';
import { CustomTextInput } from '../_commom/form-elements';
import QuillComponent from '../_commom/quill-component';

function EditCustomizations({ setBookingData, bookingData, setShow }) {
  const [customItems, setCustomItems] = useState(
    bookingData?.components?.customDetails || {}
  );
  const [customPrice, setCustomPrice] = useState(
    bookingData?.price_components?.customPrice || {}
  );
  const [value, setValue] = useState(
    bookingData?.components?.customDetails?.description || ''
  );
  const [deltaValue, setDeltaValue] = useState('');
  const [quillError, setQuillError] = useState(false);
  const [customError, setCustomError] = useState('');

  const handleSubmit = async () => {
    if (!value) {
      setQuillError(true);
      return false;
    }
    if (!customItems.name || !customItems.price || !customItems.count) {
      setCustomError('Please fill all the fields');
      return false;
    }
    setBookingData((currentData) => ({
      ...currentData,
      components: {
        ...currentData.components,
        customDetails: {
          name: customItems.name,
          description: value,
          price: customItems.price,
          count: customItems.count,
        },
      },
      price_components: {
        ...currentData.price_components,
        customPrice: {
          rackPrice: customItems.price * customItems.count,
          discount: 0,
          priceAfterDiscount: customItems.price * customItems.count,
          discountNotes: '-',
        },
      },
      booking_status: 'discountApprovalPending',
    }));
    setShow(false);
  };

  return (
    <div>
      {/* Add Customization */}
      <Row className="custom-form arrow-hidden  mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
        <Col xs={12} md={6} className="">
          <CustomTextInput
            label="Item Type"
            name="name"
            type="text"
            placeholder="Item Type"
            value={customItems.name}
            onChange={(e) =>
              setCustomItems((currentData) => ({
                ...currentData,
                name: e.target.value,
              }))
            }
          />
        </Col>
        <Col xs={6} md={2} className="">
          <CustomTextInput
            label="Portion"
            name="count"
            type="number"
            placeholder="Portion"
            value={customItems.count}
            onChange={(e) =>
              setCustomItems((currentData) => ({
                ...currentData,
                count: e.target.value,
              }))
            }
          />
        </Col>
        <Col xs={6} md={4} className="">
          <CustomTextInput
            label="Price per portion (BDT)"
            name="price"
            type="number"
            placeholder="Item Price"
            value={customItems.price}
            onChange={(e) =>
              setCustomItems((currentData) => ({
                ...currentData,
                price: e.target.value,
              }))
            }
          />
        </Col>

        <Col md={12} className={quillError ? 'mt-4 q-error' : 'mt-4'}>
          <label className="form-label">Description</label>
          <div className="my-2 min-vh-50">
            <QuillComponent
              value={value}
              setValue={setValue}
              deltaValue={deltaValue}
              setDeltaValue={setDeltaValue}
            />
          </div>
        </Col>

        <Col md={12} className="d-flex justify-content-end mt-1">
          <span className="text-danger">{customError}</span>
          <ReactiveButton
            buttonState="idle"
            idleText="Add"
            color="green"
            rounded
            onClick={handleSubmit}
          />
        </Col>
      </Row>
    </div>
  );
}

export default EditCustomizations;
