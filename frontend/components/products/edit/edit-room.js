import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import ReactiveButton from 'reactive-button';

import QuillComponent from '@/components/_commom/quill-component';
import ImageUpload from '@/components/_commom/image-upload';
import {
  CustomSelect,
  CustomTextInput,
} from '@/components/_commom/form-elements';
import { editRoomApi, listRoomTypesApi } from '@/api/products-api';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';

function EditRoom({ productDetail, isNew, setRefresh, setShow }) {
  const [value, setValue] = useState(productDetail?.description);
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [image, setImage] = useState(productDetail?.image_url || '');

  useEffect(() => {
    const fetchProductTypes = async () => {
      const productTypesTemp = await listRoomTypesApi();
      setProductTypes(productTypesTemp);
    };
    fetchProductTypes();
  }, []);

  const handleSubmit = async (productData) => {
    if (productData) {
      const apiResult = await editRoomApi(productData, value, image, isNew);
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
      <Formik
        initialValues={{
          imageUrl: isNew ? '' : productDetail?.image_url,
          roomId: isNew ? 0 : productDetail?.id,
          categoryId: isNew ? productTypes[0]?.id : productDetail?.room_type_id,
          roomNumber: isNew ? '' : productDetail?.room_number,
          roomName: isNew ? '' : productDetail?.room_name,
          roomLocation: isNew ? '' : productDetail?.room_location,
        }}
        enableReinitialize={true}
        // validationSchema={validationRules}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form arrow-hidden">
              <Row>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center">
                  <div className="mb-2">
                    <CustomSelect label="Select Type" name="categoryId">
                      {productTypes?.map(({ id, room_type_name }) => (
                        <option key={id} value={id}>
                          {camelCaseToCapitalizedString(room_type_name)}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Name of Item"
                      name="roomName"
                      type="text"
                      placeholder="Item Name"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Room Number"
                      name="roomNumber"
                      type="text"
                      placeholder="Room Number"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Location"
                      name="roomLocation"
                      type="text"
                      placeholder="Location"
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <ImageUpload
                    setImage={setImage}
                    imageFile={productDetail?.image_url || ''}
                    saveLocation={'products/rooms'}
                  />
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

export default EditRoom;
