import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllPackagesApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKey,
  updateStateArray,
  updateStateObject,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';
import { getMaxDiscountSlab } from '@/api/booking-api';

function EditPackage({ setBookingData, bookingData, setShow }) {
  const [productList, setProductList] = useState([]);
  const [packageItems, setPackageItems] = useState(
    bookingData?.components?.packageDetails?.length
      ? bookingData?.components?.packageDetails
      : []
  );
  const [packagePrice, setPackagePrice] = useState(
    bookingData?.price_components?.packagePrice
      ? bookingData?.price_components?.packagePrice
      : []
  );

  useEffect(() => {
    const fetchPackageList = async () => {
      const allProductList = await listAllPackagesApi();
      const filteredExistingItems = allProductList.filter(
        (item) =>
          !packageItems.some((existingItem) => existingItem.id === item.id)
      );
      setProductList(
        filteredExistingItems.map((obj, index) => {
          return { ...obj, value: index, label: obj.name };
        })
      );
    };
    fetchPackageList();
  }, []);

  const handleDeleteItem = (index) => {
    setPackageItems(
      packageItems.filter((item, currentIndex) => currentIndex !== index)
    );

    updateStateObject(
      setPackagePrice,
      'rackPrice',
      sumOfKey(
        packageItems.filter((item, currentIndex) => currentIndex !== index),
        'package_cost'
      )
    );

    updateStateObject(
      setPackagePrice,
      'priceAfterDiscount',
      Math.floor(
        sumOfKey(
          packageItems.filter((item, currentIndex) => currentIndex !== index),
          'package_cost'
        )
      ) || 0
    );
    setProductList([
      ...productList,
      ...packageItems.filter((item, currentIndex) => currentIndex === index),
    ]);
  };

  const handleItemCountChange = (e, index, key) => {
    const packageCost =
      key === 'adult_count'
        ? (packageItems[index].price_kids * packageItems[index].kids_count ||
            0) +
          e.target.value * packageItems[index].price_adult
        : e.target.value * packageItems[index].price_kids +
          (packageItems[index].adult_count * packageItems[index].price_adult ||
            0);

    updateStateArray(
      index,
      key,
      // 'package_count',
      e.target.value,
      setPackageItems,
      packageItems
    );
    updateStateArray(
      index,
      'package_cost',
      packageCost,
      setPackageItems,
      packageItems
    );
    updateStateObject(
      setPackagePrice,
      'rackPrice',
      sumOfKey(packageItems, 'package_cost')
    );
    updateStateObject(
      setPackagePrice,
      'discount',
      roundUptoFixedDigits(
        ((sumOfKey(packageItems, 'package_cost') -
          Math.floor(sumOfKey(packageItems, 'package_cost'))) *
          100) /
          sumOfKey(packageItems, 'package_cost'),
        2
      ) || 0
    );
    updateStateObject(
      setPackagePrice,
      'priceAfterDiscount',
      Math.floor(sumOfKey(packageItems, 'package_cost')) || 0
    );
    updateStateObject(setPackagePrice, 'discountNotes', '-');
  };

  const handleDiscountChange = (e) => {
    updateStateObject(setPackagePrice, 'priceAfterDiscount', e.target.value);
    updateStateObject(
      setPackagePrice,
      'discount',
      roundUptoFixedDigits(
        ((packagePrice.rackPrice - e.target.value) * 100) /
          packagePrice.rackPrice,
        2
      )
    );
  };

  const handleSelect = (value) => {
    setPackageItems((currentData) => [...currentData, value]);
    setProductList(productList.filter((item) => item.id !== value.id));
  };

  const handleSubmit = async () => {
    //If discount over threshold
    const maxDiscountSlab = await getMaxDiscountSlab();
    if (
      ((packagePrice.rackPrice - packagePrice.priceAfterDiscount) * 100) /
        packagePrice.rackPrice >
      maxDiscountSlab
    ) {
      alert(`Discount is above maximum allowed percentage`);
      return false;
    }
    setBookingData((currentData) => ({
      ...currentData,
      components: {
        ...currentData.components,
        packageDetails: packageItems,
      },
      price_components: {
        ...currentData.price_components,
        packagePrice: {
          ...packagePrice,
          discount: roundUptoFixedDigits(
            ((packagePrice.rackPrice - packagePrice.priceAfterDiscount) * 100) /
              packagePrice.rackPrice,
            2
          ),
        },
      },
      booking_status: 'discountApprovalPending',
    }));
    setShow(false);
  };

  return (
    <div>
      {/* Dropdown element for all items */}
      {!packageItems.length && (
        <div className="py-2">
          <label>Select package</label>
          <Select
            options={productList}
            onChange={(value) => handleSelect(value)}
          />
        </div>
      )}

      {/* New version */}
      {packageItems.map(
        (
          {
            name,
            adult_count,
            kids_count,
            package_cost,
            unit,
            unit_kids,
            price_kids,
          },
          index
        ) => (
          <Row
            key={index}
            className="custom-form arrow-hidden  mx-1 mx-sm-0 mt-3 pb-3 border-bottom font-small">
            <Col md={5} xs={6} className="text-nowrap">
              {name}
              {/* Input for mobile screen */}
              <div className="d-block d-sm-none">
                <input
                  type="number"
                  className="my-1 py-0 text-end w-75px"
                  min={0}
                  name={`itemCount_${index}`}
                  value={adult_count}
                  onChange={(e) =>
                    handleItemCountChange(e, index, 'adult_count')
                  }
                />
                <span className="ms-1 smaller-label">{unit}</span>

                {price_kids > 0 && (
                  <div>
                    <input
                      type="number"
                      className="py-0 text-end w-75px"
                      min={0}
                      name={`itemCount_${index}`}
                      value={kids_count}
                      onChange={(e) =>
                        handleItemCountChange(e, index, 'kids_count')
                      }
                    />
                    <span className="ms-1 smaller-label">{unit_kids}</span>
                  </div>
                )}
              </div>
            </Col>
            {/* Input for laptop */}
            <Col md={2} className="d-none d-sm-block">
              <input
                type="number"
                className="py-0 text-end w-100px"
                min={0}
                name={`itemCount_${index}`}
                value={adult_count}
                onChange={(e) => handleItemCountChange(e, index, 'adult_count')}
              />
              <div className="font-small">{unit}</div>
            </Col>

            <Col md={2} className="d-none d-sm-block">
              {price_kids > 0 && (
                <div>
                  <input
                    type="number"
                    className="py-0 text-end w-100px"
                    min={0}
                    name={`itemCount_${index}`}
                    value={kids_count}
                    onChange={(e) =>
                      handleItemCountChange(e, index, 'kids_count')
                    }
                  />
                  <div className="font-small">{unit_kids}</div>
                </div>
              )}
            </Col>

            <Col md={2} xs={5} className="text-end">
              {BDTFormat.format(package_cost || 0)}
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
      <div className="mx-3 mx-sm-0">
        <Row className="border-top border-1 border-dark pt-2 align-items-start custom-form">
          <Col
            xs={4}
            md={6}
            className="text-end font-small p-0 d-flex align-items-center justify-content-end">
            Total Cost (BDT)
          </Col>
          <Col md={2} xs={0} className="d-none d-md-block"></Col>
          <Col md={3} xs={8} className="d-flex justify-content-end">
            <input
              name="packageCost"
              type="text"
              value={BDTFormat.format(
                sumOfKey(packageItems, 'package_cost') || 0
              )}
              disabled
              className="font-small my-0 py-1 fw-bold text-end rounded-0"
            />
          </Col>
        </Row>

        <Row className="my-3 custom-form arrow-hidden">
          <Col
            xs={4}
            md={6}
            className="text-end font-small p-0 d-flex align-items-center justify-content-end">
            Discounted Cost (BDT)
          </Col>
          <Col md={2} xs={0} className="d-none d-md-block"></Col>
          <Col md={3} xs={7} className="">
            <input
              name="discountedPrice"
              type="number"
              max={Math.round(sumOfKey(packageItems, 'package_cost')) || 0}
              min={
                Math.round(sumOfKey(packageItems, 'package_cost') * 0.01) || 0
              }
              value={Math.floor(packagePrice.priceAfterDiscount) || 0}
              onChange={(e) => {
                handleDiscountChange(e);
              }}
              className="font-small my-0 py-1 fw-bold text-end rounded-0"
            />
          </Col>
          <Col
            md={1}
            xs={1}
            className="label-text p-0 d-flex align-items-center">
            {roundUptoFixedDigits(
              ((packagePrice.rackPrice - packagePrice.priceAfterDiscount) *
                100) /
                packagePrice.rackPrice,
              2
            )}
            %
          </Col>
        </Row>

        <Row className="my-3 custom-form">
          <Col
            xs={4}
            md={6}
            className="text-end font-small p-0 d-flex align-items-center justify-content-end">
            Discount Notes
          </Col>
          <Col md={5} xs={8} className="">
            <textarea
              value={packagePrice.discountNotes}
              onChange={(e) => {
                updateStateObject(
                  setPackagePrice,
                  'discountNotes',
                  e.target.value
                );
              }}
            />
          </Col>
        </Row>
      </div>

      <Row>
        <Col md={11} className="d-flex justify-content-end mt-4">
          <ReactiveButton
            buttonState="idle"
            idleText="Submit"
            color="green"
            onClick={handleSubmit}
          />
        </Col>
      </Row>
    </div>
  );
}

export default EditPackage;
