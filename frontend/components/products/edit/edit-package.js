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
import { editPackageApi, listPackageTypesApi } from '@/api/products-api';

function EditPackage({ productDetail, isNew, setRefresh, setShow }) {
  const [value, setValue] = useState(productDetail.description);
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [image, setImage] = useState(productDetail?.image_url || '');

  useEffect(() => {
    const fetchProductTypes = async () => {
      const productTypesTemp = await listPackageTypesApi();
      setProductTypes(productTypesTemp);
    };
    fetchProductTypes();
  }, []);

  const handleSubmit = async (productData) => {
    if (productData) {
      const apiResult = await editPackageApi(productData, value, image);
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
          name: isNew ? '' : productDetail.name,
          priceAdult: isNew ? 0 : productDetail.price_adult,
          priceKids: isNew ? 0 : productDetail.price_kids,
          imageUrl: isNew ? '' : productDetail.image_url,
          unit: isNew ? 'Per person per day' : productDetail.unit,
          unitKids: isNew ? 'Per person per day' : productDetail.unit_kids,
          productType: isNew ? 1 : productDetail.category_id,
          packageId: isNew ? 0 : productDetail.id,
        }}
        // validationSchema={validationRules}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form arrow-hidden">
              <Row>
                <Col md={6}>
                  <div className="mb-2">
                    <CustomSelect label="Select Type" name="productType">
                      {productTypes?.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Name of Package"
                      name="name"
                      type="text"
                      placeholder="Package Name"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Price for Adults (BDT)"
                      name="priceAdult"
                      type="number"
                      placeholder="Package Price"
                    />
                  </div>
                  <div className="my-2">
                    <CustomTextInput
                      label="Unit for Adults"
                      name="unit"
                      type="text"
                      placeholder="Unit of price"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Price for Kids (BDT)"
                      name="priceKids"
                      type="number"
                      placeholder="Package Price"
                    />
                  </div>
                  <div className="my-2">
                    <CustomTextInput
                      label="Unit for Kids"
                      name="unitKids"
                      type="text"
                      placeholder="Unit of price"
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <ImageUpload
                    setImage={setImage}
                    imageFile={productDetail.image_url || ''}
                    saveLocation={'products/packages'}
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

export default EditPackage;
