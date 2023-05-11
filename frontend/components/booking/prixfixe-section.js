import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllPrixfixeApi } from '@/api/products-api';
import { updateStateArray } from '@/components/_functions/common-functions';

function PrixfixeSection({ setBookingData }) {
  const [packageData, setPackageData] = useState([]);
  const [productList, setProductList] = useState([]);

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

  return (
    <div>
      {/* Select element for all packages */}
      <div className="py-2">
        <label>Select prix fixe menu</label>
        <Select
          options={productList}
          onChange={(value) => {
            setPackageData((currentData) => [...currentData, value]);
            setProductList(productList.filter((item) => item.id !== value.id));
            setBookingData((currentData) => ({
              ...currentData,
              totalPrixfixeCost:
                packageData.reduce(
                  (accumulator, currentData) =>
                    parseFloat(accumulator) +
                    parseFloat(currentData.prixfixe_cost || 0),
                  0
                ) + (value.prixfixe_cost || 0),
              prixfixeDetails: [...packageData, value],
            }));
          }}
        />
      </div>
      {/* Calculate pakcage cost */}
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
              onClick={() => handleDeleteItem(index)}>
              <Icon
                nameIcon="FaTimesCircle"
                propsIcon={{ size: 18, color: '#fc7e7e' }}
              />
            </Button>
          </Col>

          {/* Adult count */}
          <Col md={2} xs={6} className="pe-0">
            <input
              name={`prixfixeCount_${index}`}
              type="text"
              defaultValue={singlePackage.prixfixe_count}
              className="smaller-label my-1 text-end"
              onChange={(e) => {
                updateStateArray(
                  index,
                  'prixfixe_count',
                  e.target.value,
                  setPackageData,
                  packageData
                );
                updateStateArray(
                  index,
                  'prixfixe_cost',
                  e.target.value * singlePackage.price,
                  setPackageData,
                  packageData
                );
                setBookingData((currentData) => ({
                  ...currentData,
                  totalPrixfixeCost: packageData.reduce(
                    (accumulator, currentData) =>
                      parseFloat(accumulator) +
                      parseFloat(currentData.prixfixe_cost || 0),
                    0
                  ),
                  prixfixeDetails: packageData,
                }));
              }}
            />
            <label className="smaller-label fw-light justify-content-end">
              Person/meal
            </label>
          </Col>

          {/* Prixfixe cost */}
          <Col md={2} xs={6}>
            <input
              name={`prixfixeCost_${index}`}
              type="text"
              value={singlePackage.prixfixe_count * singlePackage.price || 0}
              disabled
              className="smaller-label my-1 text-end"
            />
            <label className="smaller-label fw-light justify-content-end">
              Prixfixe menu cost, BDT
            </label>
          </Col>

          {/* Line item cost */}
          <Col md={2}>
            <input
              name="prixfixeCost"
              type="text"
              value={parseFloat(singlePackage.prixfixe_cost || 0) || 0}
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

      {/* Total menu cost */}
      <Row className="border-top border-1 border-dark mt-3 pt-2 align-items-start">
        <Col xs={6} md={8} className="text-end font-small pt-1">
          Total Prixfixe Menu Cost (BDT)
        </Col>

        <Col md={4} xs={6}>
          <input
            name="packageCost"
            type="text"
            value={packageData.reduce(
              (accumulator, currentData) =>
                parseFloat(accumulator) +
                parseFloat(currentData.prixfixe_cost || 0),
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
      </Row>
    </div>
  );
}

export default PrixfixeSection;
