import React, { useState, useEffect } from 'react';
import { getCsrfToken, signIn } from 'next-auth/react';
import { Col, Row } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ResetPassword from '@/components/auth/reset-password';

export default function SignIn({ csrfToken, session }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [buttonState, setButtonState] = useState('idle');
  const [passwordReset, setPasswordReset] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState('loading');
    await signIn('credentials', {
      email,
      password,
      callbackUrl: `${window.location.origin}/`,
      // redirect: false, // Prevent automatic redirect after successful login
    });
  };

  return (
    <div>
      {!passwordReset ? (
        <div className="center-flex vh-100">
          <div className="center-flex bg-light bg-gradient rounded-3 border shadow p-5">
            <form
              method="post"
              onSubmit={(e) => handleSubmit(e)}
              className="custom-form">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
                <Col xs={4} className="fw-bold  d-flex align-items-center">
                  Password
                </Col>
                <Col xs={8}>
                  <input
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
                <div className="center-flex mt-5">
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
                      <RiseLoader
                        color="#ffffff"
                        size={5}
                        speedMultiplier={2}
                      />
                    }
                    messageDuration={5000}
                    animation={true}
                    className="bg-gradient rounded-1 px-4"
                  />
                </div>
                <Link href="/auth/reset-password" className="center-flex mt-5">
                  <ReactiveButton
                    type="submit"
                    size="small"
                    buttonState="idle"
                    idleText={
                      <h5 className="my-0 font-small">Forgot Password?</h5>
                    }
                    color="yellow"
                    outline
                    className="bg-gradient px-4"
                    onClick={() => setPasswordReset(true)}
                  />
                </Link>
              </Row>
            </form>
          </div>
        </div>
      ) : (
        <ResetPassword setPasswordReset={setPasswordReset} />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
