import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import ReactiveButton from 'reactive-button';

import QuillComponent from '@/components/products/quill-component';
import { CustomTextInput } from '@/components/_commom/form-elements';

function AddNewPackage() {
  const [value, setValue] = useState('');
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (productData) => {
    console.log('productData: ' + JSON.stringify(productData));
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
          categoryId: 0,
          description: '',
          priceAdult: 0,
          priceKids: 0,
          imageUrl: '',
          unit: 'Per person per day',
          unitKids: 'Per kid per day',
        }}
        // validationSchema={validationRules}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form">
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
                      type="text"
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
                      type="text"
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
                  <div className="mt-4">
                    <QuillComponent
                      value={value}
                      setValue={setValue}
                      deltaValue={deltaValue}
                      setDeltaValue={setDeltaValue}
                    />
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-center my-2">
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
