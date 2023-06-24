import { CustomTextInput } from '@/components/_commom/form-elements';
import { LogOutButton } from '@/components/auth/auth-buttons';
import axios from 'axios';
import { Form, Formik } from 'formik';
import React from 'react';
import ReactiveButton from 'reactive-button';
import * as Yup from 'yup';
import { signOut } from 'next-auth/react';

const validationRules = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function ChangePassword({ session }) {
  const handleSubmit = async (values) => {
    const apiResult = await axios.post(
      '/api/server/user-management/change-password-api',
      {
        email: session.user.email,
        newPassword: values.newPassword,
      }
    );
    if (apiResult.data.successStatus) {
      alert('Password changed successfully. Please login with new password');
      signOut();
    }
  };
  return (
    <div className="center-flex flex-column mt-5">
      <div className="center-flex flex-column bg-white bg-gradient rounded-3 border shadow p-5">
        <h2>Please set new password</h2>
        <Formik
          initialValues={{
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={validationRules}
          onSubmit={(values) => handleSubmit(values)}>
          {(formik) => {
            const { values } = formik;
            return (
              <Form className="custom-form min-vw-30">
                <div className="">
                  <div className="mt-3">
                    <CustomTextInput
                      type="password"
                      label="New Password"
                      name="newPassword"
                    />
                  </div>

                  <div className="mt-3">
                    <CustomTextInput
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                    />
                  </div>

                  <div className="center-flex mt-5">
                    <ReactiveButton
                      type={'submit'}
                      buttonState="idle"
                      size="small"
                      idleText={
                        <span className="fw-bold">Change Password</span>
                      }
                      color="indigo"
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default ChangePassword;
