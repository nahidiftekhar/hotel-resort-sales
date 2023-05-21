import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllPrixfixeApi } from '@/api/products-api';
import {
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';

function EditPrixfixe({ setBookingData, bookingData }) {
  const [productList, setProductList] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [prixfixeItems, setPrixfixeItems] = useState(
    bookingData?.components?.prixfixeDetails?.length
      ? bookingData?.components?.prixfixeDetails
      : []
  );
  const [prixfixePrice, setPrixfixePrice] = useState(
    bookingData?.components?.prixfixeDetails?.length
      ? bookingData?.price_components?.prixfixePrice
      : []
  );

  useEffect(() => {
    const fetchPackageList = async () => {
      const allPackageList = await listAllPrixfixeApi();
      setProductList(
        allPackageList.map((obj, index) => {
          return { ...obj, value: index, label: obj.name };
        })
      );
    };
    fetchPackageList();
  }, []);

  const handleDeleteItem = (index) => {
    setPackageData(
      packageData.filter((item, currentIndex) => currentIndex !== index)
    );
    setPrixfixeItems(
      prixfixeItems.filter((item, currentIndex) => currentIndex !== index)
    );
    setBookingData((currentData) => ({
      ...currentData,
      totalPrixfixeCost: packageData
        .filter((item, currentIndex) => currentIndex !== index)
        .reduce(
          (accumulator, currentData) =>
            parseFloat(accumulator) +
            parseFloat(currentData.prixfixe_cost || 0),
          0
        ),
      prixfixeDetails: packageData,
    }));
    setProductList([
      ...productList,
      ...packageData.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  const handleItemCountChange = (e, index) => {
    console.log(e.target.value);
    updateStateArray(
      index,
      'prixfixe_count',
      e.target.value,
      setPrixfixeItems,
      prixfixeItems
    );
    updateStateArray(
      index,
      'prixfixe_cost',
      Math.max(e.target.value * prixfixeItems[index].price, 0),
      setPrixfixeItems,
      prixfixeItems
    );
    updateStateObject(setPrixfixePrice, 'rackPrice', 0);
    updateStateObject(setPrixfixePrice, 'discount', 0);
    updateStateObject(
      setPrixfixePrice,
      'priceAfterDiscount',
      sumOfKey(prixfixeItems, 'prixfixe_cost') || 0
    );
    updateStateObject(setPrixfixePrice, 'discountNotes', '-');
  };

  const handleSelect = (value) => {
    setPrixfixeItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.id));
  };

  return (
    <div>
      <div>{JSON.stringify(prixfixePrice)}</div>
      <div>Count: {bookingData.components.prixfixeDetails?.length}</div>
      {/* Dropdown element for all items */}
      <div className="py-2">
        <label>Select prix fixe menu</label>
        <Select
          options={productList}
          onChange={(value) => handleSelect(value)}
        />
      </div>

      {/* New version */}
      {prixfixeItems.map(
        ({ name, price, prixfixe_count, prixfixe_cost }, index) => (
          <Row
            key={index}
            className="custom-form arrow-hidden mt-3 pb-3 border-bottom font-small">
            <Col md={5} xs={6}>
              {name}
              {/* Input for mobile screen */}
              <div className="d-block d-sm-none">
                <input
                  type="number"
                  className="py-0 text-end w-75px"
                  name={`itemCount_${index}`}
                  value={prixfixe_count}
                  onChange={(e) => handleItemCountChange(e, index)}
                />
                <span className="font-small ms-1">Portions</span>
              </div>
            </Col>
            {/* Input for laptop */}
            <Col md={3} className="d-none d-sm-block">
              <input
                type="number"
                className="py-0 text-end w-100px"
                min={0}
                name={`itemCount_${index}`}
                value={prixfixe_count}
                onChange={(e) => handleItemCountChange(e, index)}
              />
              <span className="font-small mx-3">Portions</span>
            </Col>
            <Col md={3} xs={5} className="text-end">
              {BDTFormat.format(prixfixe_cost || 0)}
            </Col>
            <Col md={1} xs={1}>
              <div className="circular-button-wrapper">
                <ReactiveButton
                  buttonState="idle"
                  rounded
                  color="red"
                  buttonType="filled"
                  className="circular-button"
                  idleText={
                    <Icon
                      nameIcon="FaTimesCircle"
                      propsIcon={{ size: 18, color: '#fff' }}
                    />
                  }
                  onClick={() => handleDeleteItem(index)}
                />
              </div>
            </Col>
          </Row>
        )
      )}

      {/* Total menu cost */}
      <Row className="border-top border-1 border-dark pt-2 align-items-start custom-form">
        <Col xs={6} md={8} className="text-end font-small pt-1">
          Total Prixfixe Menu Cost (BDT)
        </Col>

        <Col md={3} xs={6} className="d-flex justify-content-end">
          <input
            name="packageCost"
            type="text"
            value={BDTFormat.format(
              sumOfKey(prixfixeItems, 'prixfixe_cost') || 0
            )}
            disabled
            className="font-small my-0 py-1 fw-bold text-end rounded-0"
          />
        </Col>
      </Row>

      <Row className="my-2 custom-form arrow-hidden">
        <Col xs={6} md={8} className="text-end font-small pt-1">
          Discounted Prixfixe Menu Cost (BDT)
        </Col>
        <Col md={3} xs={6} className="d-flex justify-content-end">
          <input
            name="discountedPrice"
            type="number"
            max={Math.round(sumOfKey(prixfixeItems, 'prixfixe_cost')) || 0}
            min={
              Math.round(sumOfKey(prixfixeItems, 'prixfixe_cost') * 0.5) || 0
            }
            defaultValue={
              Math.round(sumOfKey(prixfixeItems, 'prixfixe_cost')) || 0
            }
            onChange={(e) => {
              updateStateObject(
                setPrixfixePrice,
                'priceAfterDiscount',
                e.target.value
              );
            }}
            className="font-small my-0 py-1 fw-bold text-end rounded-0"
          />
        </Col>
      </Row>

      {/* <Col
          md={2}
          xs={3}
          className="d-flex justify-content-md-around justify-content-end">
          <ReactiveButton
            buttonState="idle"
            idleText="Confirm"
            size="tiny"
            color="blue"
            outline
            rounded
            onClick={() =>
              setBookingData((currentData) => ({
                ...currentData,
                totalPrixfixeCost: packageData.reduce(
                  (accumulator, currentData) =>
                    parseFloat(accumulator) +
                    parseFloat(currentData.prixfixe_cost || 0),
                  0
                ),
                prixfixeDetails: packageData,
              }))
            }
          />
        </Col> */}
    </div>
  );
}

export default EditPrixfixe;
