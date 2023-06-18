import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  CustomSelect,
  CustomTextInput,
} from '@/components/_commom/form-elements';

const validationRules = Yup.object({
  userName: Yup.string().required('User name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

export default function CreateUser() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [buttonState, setButtonState] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState('loading');
  };

  return (
    <div className="center-flex min-vh-70">
      <div className="center-flex bg-light bg-gradient rounded-3 border shadow p-5">
        <Formik
          initialValues={{
            name: isNew ? '' : productDetail.name,
            price: isNew ? 0 : productDetail.price,
            imageUrl: isNew ? '' : productDetail.image_url,
            productType: isNew ? 1 : productDetail.category_id,
            prixfixeId: isNew ? 0 : productDetail.id,
          }}
          validationSchema={validationRules}
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
                        label="Name of Item"
                        name="name"
                        type="text"
                        placeholder="Item Name"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-5">
                  <ReactiveButton
                    type="submit"
                    size="small"
                    buttonState={buttonState}
                    idleText={
                      <h5 className="my-0 fw-bold text-uppercase text-white">
                        Add User
                      </h5>
                    }
                    color="indigo"
                    loadingText={
                      <RiseLoader
                        color="#ffffff"
                        size={5}
                        speedMultiplier={2}
                      />
                    }
                    messageDuration={5000}
                    animation={true}
                    className="bg-gradient rounded-1 px-5"
                  />
                </div>
              </Form>
            );
          }}
        </Formik>

        {/* <form
          method="post"
          onSubmit={(e) => handleSubmit(e)}
          className="custom-form">
          <Row className="gy-4 max-w-500">
            <Col xs={4} className="fw-bold d-flex align-items-center">
              Email
            </Col>
            <Col xs={8}>
              <input
                name="username"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>

            <div className="d-flex justify-content-end mt-5">
              <ReactiveButton
                type="submit"
                size="small"
                buttonState={buttonState}
                idleText={
                  <h5 className="my-0 fw-bold text-uppercase text-white">
                    Sign in
                  </h5>
                }
                color="indigo"
                loadingText={
                  <RiseLoader color="#ffffff" size={5} speedMultiplier={2} />
                }
                messageDuration={5000}
                animation={true}
                className="bg-gradient rounded-1 px-5"
              />
            </div>
          </Row>
        </form> */}
      </div>
    </div>
  );
}
