import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllAlacarteApi } from '@/api/products-api';
import { updateStateArray } from '@/components/_functions/common-functions';

function AlacarteSection({ setBookingData }) {
  const [packageData, setPackageData] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchPackageList = async () => {
      const allPackageList = await listAllAlacarteApi();
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
    setBookingData((currentData) => ({
      ...currentData,
      totalAlacarteCost: packageData
        .filter((item, currentIndex) => currentIndex !== index)
        .reduce(
          (accumulator, currentData) =>
            parseFloat(accumulator) +
            parseFloat(currentData.alacarte_cost || 0),
          0
        ),
      alacarteDetails: packageData,
    }));
    setProductList([
      ...productList,
      ...packageData.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  return (
    <div>
      {/* Select element for all items */}
      <div className="py-2">
        <label>Select alacarte menu</label>
        <Select
          options={productList}
          onChange={(value) => {
            setPackageData((currentData) => [...currentData, value]);
            setProductList(productList.filter((item) => item.id !== value.id));
            setBookingData((currentData) => ({
              ...currentData,
              totalAlacarteCost:
                packageData.reduce(
                  (accumulator, currentData) =>
                    parseFloat(accumulator) +
                    parseFloat(currentData.alacarte_cost || 0),
                  0
                ) + (value.alacarte_cost || 0),
              alacarteDetails: [...packageData, value],
            }));
          }}
        />
      </div>
      {/* Calculate menu cost */}
      {packageData.map((singlePackage, index) => (
        <Row
          key={index}
          className="my-2 mx-1 border-bottom bg-light py-1 px-0 rounded">
          {/* Menu item name */}
          <Col md={4} xs={11} className="">
            <input
              type="text"
              value={singlePackage.name}
              disabled
              className="smaller-label my-1"
            />
          </Col>

          {/* Button for mobile */}
          <Col
            xs={1}
            className="d-flex justify-content-md-around justify-content-end pt-2 mb-4 mb-md-2 d-sm-none">
            <Button
              variant="light"
              className="p-0 rounded-circle d-flex justify-content-center align-items-center square-button"
              // onClick={() =>
              //   setPackageData(
              //     packageData.filter(
              //       (item, currentIndex) => currentIndex !== index
              //     )
              //   )
              // }
              onClick={() => handleDeleteItem(index)}>
              <Icon
                nameIcon="FaTimesCircle"
                propsIcon={{ size: 18, color: '#fc7e7e' }}
              />
            </Button>
          </Col>

          {/* count */}
          <Col md={2} xs={6} className="pe-0">
            <input
              name={`alacarteCount_${index}`}
              type="text"
              defaultValue={singlePackage.alacarte_count}
              className="smaller-label my-1 text-end"
              onChange={(e) => {
                updateStateArray(
                  index,
                  'alacarte_count',
                  e.target.value,
                  setPackageData,
                  packageData
                );
                updateStateArray(
                  index,
                  'alacarte_cost',
                  e.target.value * singlePackage.price,
                  setPackageData,
                  packageData
                );
                setBookingData((currentData) => ({
                  ...currentData,
                  totalAlacarteCost: packageData.reduce(
                    (accumulator, currentData) =>
                      parseFloat(accumulator) +
                      parseFloat(currentData.alacarte_cost || 0),
                    0
                  ),
                  alacarteDetails: packageData,
                }));
              }}
            />
            <label className="smaller-label fw-light justify-content-end">
              Person/meal
            </label>
          </Col>

          {/* alacarte cost */}
          <Col md={2} xs={6}>
            <input
              name={`alacarteCost_${index}`}
              type="text"
              value={singlePackage.alacarte_count * singlePackage.price || 0}
              disabled
              className="smaller-label my-1 text-end"
            />
            <label className="smaller-label fw-light justify-content-end">
              alacarte menu cost, BDT
            </label>
          </Col>

          {/* Line item cost */}
          <Col md={2}>
            <input
              name="alacarteCost"
              type="text"
              value={parseFloat(singlePackage.alacarte_cost || 0) || 0}
              disabled
              className="smaller-label my-1 text-end"
            />
            <label className="smaller-label fw-light justify-content-end">
              Prefixe menu cost, BDT
            </label>
          </Col>

          {/* Buttons confirm/delete */}
          <Col
            md={1}
            className="d-flex justify-content-md-around justify-content-end pt-2 mb-4 mb-md-2">
            <Button
              variant="light"
              className="p-0 rounded-circle d-flex justify-content-center align-items-center square-button d-none d-sm-grid"
              onClick={() => handleDeleteItem(index)}>
              <Icon
                nameIcon="FaTimesCircle"
                propsIcon={{ size: 18, color: '#fc7e7e' }}
              />
            </Button>
          </Col>
        </Row>
      ))}

      {/* Total Package cost */}
      <Row className="border-top border-1 border-dark mt-3 pt-2 align-items-start">
        <Col xs={6} md={8} className="text-end font-small pt-1">
          Total alacarte Menu Cost (BDT)
        </Col>

        <Col md={4} xs={6}>
          <input
            name="packageCost"
            type="text"
            value={packageData.reduce(
              (accumulator, currentData) =>
                parseFloat(accumulator) +
                parseFloat(currentData.alacarte_cost || 0),
              0
            )}
            disabled
            className="smaller-label my-0 py-1 fw-bold text-end rounded-0"
          />
        </Col>
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
                totalalacarteCost: packageData.reduce(
                  (accumulator, currentData) =>
                    parseFloat(accumulator) +
                    parseFloat(currentData.alacarte_cost || 0),
                  0
                ),
                alacarteDetails: packageData,
              }))
            }
          />
        </Col> */}
      </Row>
    </div>
  );
}

export default AlacarteSection;
