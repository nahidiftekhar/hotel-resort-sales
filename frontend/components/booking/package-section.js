import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllPackagesApi } from '@/api/products-api';
import { updateStateArray } from '@/components/_functions/common-functions';

function PackageSection({ setBookingData, bookingData, daysCount }) {
  const [packageData, setPackageData] = useState([]);
  const [packageList, setPackageList] = useState([]);

  useEffect(() => {
    const fetchPackageList = async () => {
      const allPackageList = await listAllPackagesApi();
      setPackageList(
        allPackageList.map((obj, index) => {
          return { ...obj, value: index, label: obj.name };
        })
      );
      setPackageData([]);
      setBookingData((currentData) => ({
        ...currentData,
        totalPackageCost: 0,
      }));
    };
    fetchPackageList();
  }, [daysCount]);

  const handleDeleteItem = (index) => {
    setPackageData(
      packageData.filter((item, currentIndex) => currentIndex !== index)
    );
    setBookingData((currentData) => ({
      ...currentData,
      totalPackageCost: packageData
        .filter((item, currentIndex) => currentIndex !== index)
        .reduce(
          (accumulator, currentData) =>
            parseFloat(accumulator) +
            parseFloat(currentData.adult_cost || 0) +
            parseFloat(currentData.kids_cost || 0),
          0
        ),
      packageDetails: packageData,
    }));
    setPackageList([
      ...packageList,
      ...packageData.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  return (
    <div>
      {/* Select element for all packages */}
      {!packageData.length && (
        <div className="py-2">
          {' '}
          {/* Only visible if no packages are selected. Allowing only a single package selection */}
          <label>Select package</label>
          <Select
            options={packageList}
            onChange={(value) => {
              setPackageData((currentData) => [...currentData, value]);
              setPackageList(
                packageList.filter((item) => item.id !== value.id)
              );
              setBookingData((currentData) => ({
                ...currentData,
                totalPackageCost:
                  packageData.reduce(
                    (accumulator, currentData) =>
                      parseFloat(accumulator) +
                      parseFloat(currentData.adult_cost || 0) +
                      parseFloat(currentData.kids_cost || 0),
                    0
                  ) +
                  (value.adult_cost || 0) +
                  (value.kids_cost || 0),
                packageDetails: [...packageData, value],
              }));
            }}
          />
        </div>
      )}
      {/* Calculate pakcage cost */}
      {packageData.map((singlePackage, index) => (
        <Row
          key={index}
          className="my-2 mx-1 border-bottom bg-light py-1 px-0 rounded">
          {/* Package name */}
          <Col md={3} xs={11} className="">
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
              onClick={() =>
                setPackageData(
                  packageData.filter(
                    (item, currentIndex) => currentIndex !== index
                  )
                )
              }>
              {/* onClick={(index) => handleDeleteItem(index)}> */}
              <Icon
                nameIcon="FaTimesCircle"
                propsIcon={{ size: 18, color: '#fc7e7e' }}
              />
            </Button>
          </Col>

          {/* Adult count */}
          <Col md={1} xs={6} className="pe-0">
            <input
              name={`adultCount_${index}`}
              type="text"
              defaultValue={singlePackage.adult_count}
              className="smaller-label my-1 text-end"
              onChange={(e) => {
                const effectiveDays =
                  singlePackage.category_id === 1 && daysCount === 0
                    ? 1
                    : daysCount;
                updateStateArray(
                  index,
                  'adult_count',
                  e.target.value,
                  setPackageData,
                  packageData
                );
                updateStateArray(
                  index,
                  'adult_cost',
                  e.target.value * singlePackage.price_adult * effectiveDays,
                  setPackageData,
                  packageData
                );
                setBookingData((currentData) => ({
                  ...currentData,
                  totalPackageCost: packageData.reduce(
                    (accumulator, currentData) =>
                      parseFloat(accumulator) +
                      parseFloat(currentData.adult_cost || 0) +
                      parseFloat(currentData.kids_cost || 0),
                    0
                  ),
                  packageDetails: packageData,
                }));
              }}
            />
            <label className="smaller-label fw-light justify-content-end">
              {singlePackage.unit}
            </label>
          </Col>
          {/* Adult cost */}
          <Col md={2} xs={6}>
            <input
              name={`aduldCost_${index}`}
              type="text"
              value={
                singlePackage.adult_count *
                  singlePackage.price_adult *
                  (singlePackage.category_id === 1 && daysCount === 0
                    ? 1
                    : daysCount) || 0
              }
              disabled
              className="smaller-label my-1 text-end"
            />
            <label className="smaller-label fw-light justify-content-end">
              Package cost (adults), BDT
            </label>
          </Col>

          {/* Kids count */}
          <Col md={1} xs={6} className="pe-0">
            <input
              name={`kidsCount_${index}`}
              type="text"
              defaultValue={singlePackage.kids_count}
              className="smaller-label my-1  text-end"
              hidden={singlePackage.price_kids <= 0}
              onChange={(e) => {
                const effectiveDays =
                  singlePackage.category_id === 1 && daysCount === 0
                    ? 1
                    : daysCount;
                updateStateArray(
                  index,
                  'kids_count',
                  e.target.value,
                  setPackageData,
                  packageData
                );
                updateStateArray(
                  index,
                  'kids_cost',
                  e.target.value * singlePackage.price_kids * effectiveDays,
                  setPackageData,
                  packageData
                );
                setBookingData((currentData) => ({
                  ...currentData,
                  totalPackageCost: packageData.reduce(
                    (accumulator, currentData) =>
                      parseFloat(accumulator) +
                      parseFloat(currentData.adult_cost || 0) +
                      parseFloat(currentData.kids_cost || 0),
                    0
                  ),
                  packageDetails: packageData,
                }));
              }}
            />
            <label
              hidden={singlePackage.price_kids <= 0}
              className="smaller-label fw-light justify-content-end">
              {singlePackage.unit_kids}
            </label>
          </Col>
          {/* Kids cost */}
          <Col md={2} xs={6}>
            <input
              name={`kidsCost_${index}`}
              type="text"
              value={
                singlePackage.kids_count *
                  singlePackage.price_kids *
                  (singlePackage.category_id === 1 && daysCount === 0
                    ? 1
                    : daysCount) || 0
              }
              disabled
              hidden={singlePackage.price_kids <= 0}
              className="smaller-label my-1 text-end"
            />
            <label
              hidden={singlePackage.price_kids <= 0}
              className="smaller-label fw-light justify-content-end">
              Package cost (kids), BDT
            </label>
          </Col>

          {/* Line item cost */}
          <Col md={2}>
            <input
              name="packageCost"
              type="text"
              value={
                parseFloat(
                  singlePackage.kids_count *
                    singlePackage.price_kids *
                    (singlePackage.category_id === 1 && daysCount === 0
                      ? 1
                      : daysCount) || 0
                ) +
                parseFloat(
                  singlePackage.adult_count *
                    singlePackage.price_adult *
                    (singlePackage.category_id === 1 && daysCount === 0
                      ? 1
                      : daysCount) || 0
                )
              }
              disabled
              className="smaller-label my-1 text-end"
            />
            <label className="smaller-label fw-light justify-content-end">
              Package cost, BDT
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
              {/* onClick={() =>
                setPackageData(
                  packageData.filter(
                    (item, currentIndex) => currentIndex !== index
                  )
                )
              }> */}
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
          Total Package Cost (BDT)
        </Col>

        <Col md={4} xs={6}>
          <input
            name="packageCost"
            type="text"
            value={bookingData.totalPackageCost}
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
                totalPackageCost: packageData.reduce(
                  (accumulator, currentData) =>
                    parseFloat(accumulator) +
                    parseFloat(currentData.adult_cost || 0) +
                    parseFloat(currentData.kids_cost || 0),
                  0
                ),
                packageDetails: packageData,
              }))
            }
          />
        </Col> */}
      </Row>
    </div>
  );
}

export default PackageSection;
