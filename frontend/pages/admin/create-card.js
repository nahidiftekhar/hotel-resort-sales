import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

import FileUpload from "@/components/admin/add-card/file-upload";
import authorizeAccess from "@/api/auth-api";
import { generateLinkApi, createCardApi } from "@/api/card-api";
import { beConfig } from "@/configs/backend";

//Set the user role that should have access to this page
const userAccessRole = 1;

export default function AddCard() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState({groupId: 1});
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState("");
  const [qrImage, setQrImage] = useState(
    image
      ? `${beConfig.host}static/images/qr/${image}`
      : `${beConfig.host}static/images/qr/_default.png`
  );

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    accessRule();
    setCardData({groupId: 1});
  }, []);

  const handleAddCard = async (event) => {
    event.preventDefault();
    const addCardResult = await createCardApi(cardData);
    setCardData({groupId: 1});
    setMsg('Card creation successful. Activation code: ' + addCardResult.activationCode);
    setImage('');
  };

  const generateLink = async (event) => {
    event.preventDefault();
    setMsg('');
    const cardLink = await generateLinkApi();
    setCardData((cardData) => ({
      ...cardData,
      cardLink: cardLink,
    }));
  };

  if (accessGranted === 100 || isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-70">
      {accessGranted ? (
        <div className="add-card">
          <Form onSubmit={handleAddCard}>
            <Row className="">
              <Col md="8">
                <Form.Group controlId="cardLink" className="my-3">
                  <Form.Label>Card Link</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    disabled
                    placeholder="Create link"
                    value={
                      cardData.cardLink
                        ? beConfig.host + cardData.cardLink
                        : ""
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={4} className="d-flex align-items-end">
                <Button onClick={generateLink} className="mb-3">
                  Generate Link
                </Button>
              </Col>
            </Row>

            {cardData.cardLink ? <><Row>
              <Col>
                <FileUpload
                  cardData={cardData}
                  setCardData={setCardData}
                  setImage={setImage}
                  imageFile={image}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formBasicPassword" className="my-3">
                  <Form.Label>Order Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Order Email"
                    value={cardData?.orderEmail}
                    onChange={(e) =>
                      setCardData((cardData) => ({
                        ...cardData,
                        orderEmail: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicPassword" className="my-3">
                  <Form.Label>Order Reference</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Order Reference"
                    value={cardData?.orderReference}
                    onChange={(e) =>
                      setCardData((cardData) => ({
                        ...cardData,
                        orderReference: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>

              <Col sm={12} className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="w-50 my-3">
                Add Card
              </Button>
              </Col>
            </Row></> : ""}

          </Form>
          <p className="error-message">{msg}</p>
        </div>
      ) : (
        <div>You do not have access to this content </div>
      )}
    </Container>
  );
}
