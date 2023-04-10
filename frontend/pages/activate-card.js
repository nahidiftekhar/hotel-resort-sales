import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";

import authorizeAccess from "./api/auth-api";
import { activateCardApi } from "@/api/action-api";

//Set the user role that should have access to this page
const userAccessRole = 0;

function ActivateCard() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [cardData, setCardData] = useState({ userId: 1 });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState();
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setUserDetails(authResult);
    // setCardData({ userId: authResult.message.userId });
    setCardData({
      ...cardData,
      userId: authResult.message.userId,
      cardLink: router.query.q,
    });
  };

  const handleActivate = async (event) => {
    event.preventDefault();
    const activateResult = await activateCardApi(cardData);
    if (!activateResult.success)
      setErrorMsg(
        activateResult.msg
          ? activateResult.msg
          : "Please provide all input correctly"
      );
    else setShowAlert(true);
  };

  useEffect(() => {
    if (!router.isReady) return;
    // setCardData({ ...cardData, cardLink: router.query.q });
    accessRule();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [router.isReady]);

  if (isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );

  if (showAlert)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert show={showAlert} variant="success">
          <Alert.Heading>Card activation successful!</Alert.Heading>
          <p> You can now configure your card from your account homepage.</p>
          <p>
            Remember to add action for your card, otherwise people will not get
            your information by scanning your card.
          </p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button
              onClick={() => {
                setShowAlert(false);
                window.location.href = "/";
              }}
              variant="outline-success"
            >
              Click to continue
            </Button>
          </div>
        </Alert>
      </Container>
    );

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <div className="home-main">
        {accessGranted ? (
          <div className="w-100">
            <Row className="mb-4">
              <Col xs={6} className="d-flex align-items-end">
                <h5>Activate your card</h5>
              </Col>
              <Col
                xs={6}
                className="d-flex align-items-end justify-content-end"
              >
                <h6 className="text-end">
                  User: {userDetails.message.userName}
                </h6>
              </Col>
            </Row>
            <Row className="px-3 justify-content-md-center">
              <Col md="12">
                <Form onSubmit={handleActivate}>
                  <Form.Group controlId="cardLink" className="my-3">
                    <Form.Label>Card Link</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your card link"
                      value={cardData.cardLink}
                      onChange={(e) =>
                        setCardData({ ...cardData, cardLink: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="activationCode" className="my-3">
                    <Form.Label>Activation Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your activation code"
                      value={cardData.activationCode}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          activationCode: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <p className="error-message">{errorMsg}</p>
                  <Button variant="primary" type="submit" className="my-2">
                    Activate Card
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>
        ) : (
          <div>You do not have access to this content </div>
        )}
      </div>
    </Container>
  );
}

export default ActivateCard;
