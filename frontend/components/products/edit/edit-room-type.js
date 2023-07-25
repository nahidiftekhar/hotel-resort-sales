import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import ReactiveButton from 'reactive-button';

import QuillComponent from '@/components/_commom/quill-component';
import ImageUpload from '@/components/_commom/image-upload';
import { CustomTextInput } from '@/components/_commom/form-elements';
import { editRoomTypeApi } from '@/api/products-api';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';

function EditRoomType({ productDetail, isNew, setRefresh, setShow }) {
  const [value, setValue] = useState(productDetail?.description);
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (productData) => {
    if (productData) {
      const apiResult = await editRoomTypeApi(productData, value, isNew);
      if (apiResult.success) {
        setRefresh(true);
        setShow(false);
      } else {
        setError(true);
        return false;
      }
    }
    if (!value) {
      setError(true);
      return false;
    }
  };

  return (
    <div className="">
      {value}
      <Formik
        initialValues={{
          roomTypeId: isNew ? 0 : productDetail?.id,
          roomTypeName: isNew ? '' : productDetail?.room_type_name,
          occupancyAdult: isNew ? 0 : productDetail?.max_adult,
          occupancyChild: isNew ? 0 : productDetail?.max_child,
          price: isNew ? 0 : productDetail.price,
        }}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form arrow-hidden">
              <Row>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center">
                  <div className="my-2">
                    <CustomTextInput
                      label="Room Type"
                      name="roomTypeName"
                      type="text"
                      placeholder="Item Name"
                    />
                  </div>
                </Col>

                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center">
                  <div className="my-2">
                    <CustomTextInput
                      label="Occupancy Adult"
                      name="occupancyAdult"
                      type="text"
                      placeholder="Occupancy Adult"
                    />
                  </div>
                </Col>

                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center">
                  <div className="my-2">
                    <CustomTextInput
                      label="Occupancy Child"
                      name="occupancyChild"
                      type="text"
                      placeholder="Occupancy Child"
                    />
                  </div>
                </Col>

                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center">
                  <div className="my-2">
                    <CustomTextInput
                      label="Price (BDT)"
                      name="price"
                      type="number"
                      placeholder="Room Rate"
                    />
                  </div>
                </Col>

                <Col md={12} className={error ? 'q-error' : ''}>
                  <div className="my-2 min-vh-50">
                    <QuillComponent
                      value={value}
                      setValue={setValue}
                      deltaValue={deltaValue}
                      setDeltaValue={setDeltaValue}
                    />
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-end my-2">
                <ReactiveButton
                  buttonState="idle"
                  idleText="Submit"
                  color="blue"
                  type="submit"
                  onClick={handleSubmit}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default EditRoomType;
