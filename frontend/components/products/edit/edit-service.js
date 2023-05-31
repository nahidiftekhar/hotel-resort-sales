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
import { editServiceApi, listServiceTypesApi } from '@/api/products-api';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';

function EditService({ productDetail, isNew, setRefresh, setShow }) {
  const [value, setValue] = useState(productDetail?.description || '');
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [image, setImage] = useState(productDetail?.image_url || '');

  useEffect(() => {
    const fetchProductTypes = async () => {
      const productTypesTemp = await listServiceTypesApi();
      setProductTypes(productTypesTemp);
    };
    fetchProductTypes();
  }, []);

  const handleSubmit = async (productData) => {
    if (productData) {
      const apiResult = await editServiceApi(productData, value, image, isNew);
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
          name: isNew ? '' : productDetail?.name,
          price: isNew ? 0 : productDetail?.price,
          imageUrl: isNew ? '' : productDetail?.image_url,
          categoryId: isNew ? 1 : productDetail?.category_id,
          serviceId: isNew ? 0 : productDetail?.id,
          size: isNew ? 0 : productDetail?.id,
        }}
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
                      {productTypes?.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {camelCaseToCapitalizedString(name)}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Name of Item"
                      name="name"
                      type="text"
                      placeholder="Item Name"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Price (BDT)"
                      name="price"
                      type="number"
                      placeholder="Item Price"
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <ImageUpload
                    setImage={setImage}
                    imageFile={productDetail?.image_url || ''}
                    saveLocation={'products/service'}
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

export default EditService;
