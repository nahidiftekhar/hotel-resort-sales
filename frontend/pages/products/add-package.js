import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import ReactiveButton from 'reactive-button';

import QuillComponent from '@/components/_commom/quill-component';
import {
  CustomSelect,
  CustomTextInput,
} from '@/components/_commom/form-elements';
import { addNewPackageApi, listPackageTypesApi } from '@/api/products-api';

function AddNewPackage() {
  const [value, setValue] = useState('');
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      const productTypesTemp = await listPackageTypesApi();
      setProductTypes(productTypesTemp);
    };
    fetchProductTypes();
  }, []);

  const handleSubmit = async (productData) => {
    if (productData) {
      const apiResult = await addNewPackageApi(productData, value);
      console.log('apiResult: ' + JSON.stringify(apiResult));
    }
    if (!value) {
      setError(true);
      return false;
    }
  };

  return (
    <div className="my-5">
      <h2 className="my-3">Please enter package details</h2>
      <Formik
        initialValues={{
          name: '',
          priceAdult: 0,
          priceKids: 0,
          imageUrl: '',
          unit: 'Per person per day',
          unitKids: 'Per kid per day',
          productType: 0,
        }}
        // validationSchema={validationRules}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form arrow-hidden">
              <Row>
                <Col md={4}>
                  <div className="my-3">
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
                <Col md={8} className={error ? 'q-error' : ''}>
                  <div className="my-3">
                    <CustomSelect label="Select Type" name="productType">
                      {productTypes?.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>

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

export default AddNewPackage;
