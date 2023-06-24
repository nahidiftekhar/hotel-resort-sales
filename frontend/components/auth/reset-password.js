import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';
import { Icon } from '../_commom/Icon';
import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default function ResetPassword({ setPasswordReset }) {
  const [email, setEmail] = useState('');
  const [buttonState, setButtonState] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState('loading');
    const apiResult = await axios.post(
      `${beConfig.host}/user-management/reset-password`,
      {
        email,
      },
      {
        headers: {
          'X-CM-API-KEY': beConfig.key,
        },
      }
    );

    if (apiResult.data.successStatus) {
      setButtonState('success');
      setTimeout(() => {
        setButtonState('idle');
        setPasswordReset(false);
      }, 10000);
    } else setButtonState('error');
  };

  return buttonState === 'success' ? (
    <div className="center-flex flex-column min-vh-70">
      <h5 className="text-center text-break">
        Check your email to complete password reset process.
      </h5>
      <p>
        If it doesn&apos;t appear within a few minutes, check your spam folder.
      </p>
    </div>
  ) : (
    <div className="center-flex vh-100">
      <div className="center-flex flex-column bg-light bg-gradient rounded-3 border shadow p-5">
        <h5 className="mb-5">Let&apos;s reset your password </h5>
        <form
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
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>

            <Col xs={6} className="text-center">
              <div className="d-flex justify-content-start align-items-center mt-5">
                <ReactiveButton
                  buttonState="idle"
                  idleText="Back to Sign In"
                  color="blue"
                  outline
                  size="tiny"
                  onClick={() => setPasswordReset(false)}
                />
              </div>
            </Col>
            <Col xs={6}>
              <div className="center-flex mt-5">
                <ReactiveButton
                  type="submit"
                  size="small"
                  buttonState={buttonState}
                  idleText={
                    <span>
                      <h6 className="d-md-none my-0 fw-bold text-white">
                        Reset Password
                      </h6>
                      <h5 className="d-none d-md-block my-0 fw-bold text-white">
                        Reset Password
                      </h5>
                    </span>
                  }
                  color="green"
                  loadingText={
                    <RiseLoader color="#ffffff" size={5} speedMultiplier={2} />
                  }
                  successText={
                    <Icon
                      nameIcon="FaSuccess"
                      propsIcon={{ size: '1.5rem', color: 'white' }}
                    />
                  }
                  errorText={
                    <Icon
                      nameIcon="BiErrorAlt"
                      propsIcon={{ size: '1.5rem', color: 'red' }}
                    />
                  }
                  messageDuration={5000}
                  animation={true}
                  className="bg-gradient rounded-1 px-4"
                />
              </div>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  );
}
