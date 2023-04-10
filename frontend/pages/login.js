import React, { useState } from "react";
import { Container, Nav, Tab, Form, Button, Row, Col } from "react-bootstrap";
import Link from "next/link";

import loginApi from "./api/loginApi";
import passwordResetApi from "./api/passwordResetApi";
import {registrationApi, resendValidationApi} from "./api/registrationApi";

function Login() {
  const [key, setKey] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passPlain, setPassPlain] = useState("");
  const [passRetype, setPassRetype] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userType, setUserType] = useState(0);
  const [mailSent, setMailSent] = useState();
  const [resend, setResend] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const loginResult = await loginApi(email, passPlain, userType);
    if (!loginResult.successStatus)
      setErrorMsg(loginResult.reason);
      // setErrorMsg("Your entered email/password was not found");
    else {
      setUserType(loginResult.userType);
      window.location.href = loginResult.userType ? "/admin/view-cards" : "/";
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    const result = await passwordResetApi(email);
    if (!result.data.successStatus) setErrorMsg(result.data.message);
    else
      setMailSent(
        "Instruction for password reset is sent to your email. Please check email and follow the steps."
      );
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    const result = await registrationApi(email, name, passPlain, userType);
    if (!result.data.successStatus) {
      setErrorMsg(result.data.message);
      setResend(result.data.emailPending);
    }
    else
      setMailSent(
        "Thanks for your input. To complete registration, please verify your email. We have sent you instruction in mail to " +
          email
      );
  };

  const handleResend = async (event) => {
    event.preventDefault();
    const result = await resendValidationApi(email);
    if (!result.data.successStatus) setErrorMsg(result.data.message);
  }

  const validatePassword = () => {
    const passwordPolicy =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    const password = document.getElementById("new_password").value;
    if (password == "") {
      document.getElementById("error-message").innerHTML =
        "Please provide new password";
    }
    if (password.match(passwordPolicy)) {
      document.getElementById("error-message1").innerHTML = "";
    } else {
      document.getElementById("error-message1").innerHTML =
        "password criteria: <ul> <li>8 to 15 characters </li><li>at least one lowercase and one uppercase letter</li><li>at least one numeric digit and one special character</li></ul>";
      document.querySelector("#submit-button").disabled = true;
    }
  }

  const confirmPassword = () => {
    const password = document.getElementById("new_password").value;
    const retypePassword = document.getElementById("retype_password").value;
    if (password == retypePassword) {
      document.getElementById("error-message2").innerHTML = "";
      //add button enable
      document.querySelector("#submit-button").disabled = false;
    } else {
      document.getElementById("error-message2").innerHTML =
        "Password does not match";
      document.querySelector("#submit-button").disabled = true;
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-70">
      <div className="login-box">
        {mailSent ? (
          <p className="success-message">{mailSent}</p>
        ) : (
          <Tab.Container
            id="controlled-tab-example"
            // defaultActiveKey={key}
            activeKey={key}
          >
            <Row>
              <Col xs={12}>
                <Nav variant="pills">
                  <Nav.Item>
                    <Nav.Link eventKey="login" onClick={(e) => setKey("login")}>Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="registration" onClick={(e) => setKey("registration")}>Signup</Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <Nav.Link eventKey="forgot" onClick={(e) => setKey("forgot")}>Reset</Nav.Link>
                  </Nav.Item> */}
                </Nav>
              </Col>

              <Col xs={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="login" title="Login">
                    <Row className="px-3 justify-content-md-center">
                      <Col md="12">
                        <Form onSubmit={handleLogin}>
                          <Form.Group controlId="formBasicEmail" className="my-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group
                            controlId="formBasicPassword"
                            className="my-3"
                          >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Password"
                              value={passPlain}
                              onChange={(e) => setPassPlain(e.target.value)}
                            />
                          </Form.Group>
                          <p className="error-message">{errorMsg}</p>
                          <Button
                            variant="primary"
                            type="submit"
                            className="w-50 my-2"
                          >
                            Login
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                    <Row className="px-3 justify-content-md-center">
                      <Col xs={6} className="tab-switcher text-start">
                        <Link href="#" onClick={(e) => setKey("forgot")}>
                          Forgot password?
                        </Link>
                      </Col>
                      <Col xs={6} className="tab-switcher text-end">
                        <a href="#" onClick={(e) => setKey("registration")}>
                          Create account
                        </a>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="registration" title="Create User">
                    <Row className="px-3 justify-content-md-center">
                      <Col md="12">
                        <Form onSubmit={handleRegistration}>
                          <Form.Group
                            controlId="registrationForm"
                            className="my-2"
                          >
                            <Form.Label>Name of User</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group
                            controlId="registrationForm"
                            className="my-2"
                          >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group
                            // controlId="formBasicPassword"
                            className="my-2"
                          >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Password"
                              id="new_password"
                              value={passPlain}
                              onChange={(e) => setPassPlain(e.target.value)}
                              onBlur={validatePassword}
                            />
                          </Form.Group>
                          <p id="error-message1" className="error-message"></p>
                          <Form.Group
                            // controlId="formBasicPasswordRetype"
                            className="my-2"
                          >
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Retype Password"
                              id="retype_password"
                              value={passRetype}
                              onChange={(e) => setPassRetype(e.target.value)}
                              onBlur={confirmPassword}
                            />
                          </Form.Group>
                          <p id="error-message2" className="error-message"></p>
                          <p className="error-message mb-2">{errorMsg}</p>
                          <Button
                            variant="primary"
                            type="submit"
                            id="submit-button"
                            className="m-1"
                          >
                            Create User
                          </Button>

                          {resend? <Button
                            variant="primary"
                            type="button"
                            id="submit-button"
                            className="m-1"
                            onClick={(e) => handleResend(e)}
                          >
                            Resend validation mail
                          </Button> : ""}
                        </Form>
                      </Col>
                    </Row>
                    <div className="tab-switcher text-center mt-1">
                      <Link href="#" onClick={(e) => setKey("login")}>
                        Already have account?
                      </Link>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="forgot" title="Password Reset">
                    <Row className="px-3 justify-content-md-center">
                      <Col md="12">
                        <Form onSubmit={handleReset}>
                          <Form.Group controlId="formBasicEmail" className="my-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Form.Group>
                          <p className="error-message">{errorMsg}</p>
                          <Button
                            variant="primary"
                            type="submit"
                            className="w-50 my-2"
                          >
                            Reset Password
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        )}
      </div>
    </Container>
  );
}

export default Login;
