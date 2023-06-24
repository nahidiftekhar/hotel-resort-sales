import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  CustomSelect,
  CustomTextInput,
} from '@/components/_commom/form-elements';
import axios from 'axios';
import { generateRandomString } from '@/components/_functions/string-format';

const validationRules = Yup.object({
  name: Yup.string().required('User name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
});

export default function CreateUser({ session }) {
  const [userData, setUserData] = useState({});
  const [userTypes, setUserTypes] = useState([]);
  const [buttonState, setButtonState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserTypes = async () => {
      const userTypesTemp = await axios.get(
        '/api/user-management/fetch-types-api'
      );
      setUserTypes(userTypesTemp.data);
    };
    fetchUserTypes();
  }, []);

  const handleSubmit = async (values) => {
    setButtonState('loading');
    const password = generateRandomString(8);
    values.password = password;
    setUserData(values);
    const apiResult = await axios.post(
      '/api/user-management/add-user-api',
      values
    );
    if (apiResult?.data?.successStatus === false) {
      setErrorMessage(apiResult?.data?.message);
      setButtonState('idle');
      return false;
    }

    if (apiResult?.data?.successStatus === true) setButtonState('success');
  };

  if (session.user.usertype !== 2)
    return (
      <Container className="center-flex min-vh-70">
        <p className="fw-bold fs-5 text-danger">You are not authrized</p>
      </Container>
    );

  return (
    <div className="center-flex min-vh-70">
      <div className="center-flex bg-light bg-gradient rounded-3 border shadow p-5">
        <div className="max-w-500">
          <h5 className="mb-4">
            {buttonState === 'success'
              ? 'User creation successful'
              : 'Add User Details'}
          </h5>
          {buttonState === 'success' ? (
            <div>
              Please note the credentials for <strong>{userData.name}</strong>
              <p className="my-1">
                Email: <strong>{userData.email}</strong>
              </p>
              <p className="my-1">
                Password: <strong>{userData.password}</strong>
              </p>
              <a
                href="/users/create-user"
                className="d-flex justify-content-end mt-5">
                <ReactiveButton
                  type="button"
                  size="small"
                  buttonState="idle"
                  idleText={
                    <h5 className="my-0 fw-bold text-uppercase text-white">
                      Add Another User
                    </h5>
                  }
                  color="indigo"
                  messageDuration={5000}
                  animation={true}
                  className="bg-gradient rounded-1 px-5"
                />
              </a>
            </div>
          ) : (
            <Formik
              initialValues={{
                name: '',
                phone: '',
                email: '',
              }}
              validationSchema={validationRules}
              onSubmit={(values) => handleSubmit(values)}>
              {(formik) => {
                const { values } = formik;
                return (
                  <Form className="custom-form arrow-hidden">
                    <Row className="gy-4">
                      <Col
                        md={12}
                        className="d-flex flex-column justify-content-center">
                        <div className="mb-2">
                          <CustomSelect label="Select Type" name="userType">
                            {userTypes?.map(({ id, user_type }) => (
                              <option key={id} value={id}>
                                {user_type}
                              </option>
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="my-2">
                          <CustomTextInput
                            label="User Name"
                            name="name"
                            type="text"
                            placeholder="User Name"
                          />
                        </div>

                        <div className="my-2">
                          <CustomTextInput
                            label="Email"
                            name="email"
                            type="text"
                            placeholder="name@email.com"
                          />
                        </div>

                        <div className="my-2">
                          <CustomTextInput
                            label="Phone Number"
                            name="phone"
                            type="text"
                            placeholder="Phone"
                          />
                        </div>

                        {errorMessage && (
                          <p className="error-message">{errorMessage}</p>
                        )}
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
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
