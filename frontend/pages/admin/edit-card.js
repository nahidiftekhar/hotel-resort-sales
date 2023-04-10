import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";

import authorizeAccess from "@/api/auth-api";
import {
  getCardInfoByCardLinkApi,
  blockCardByIdApi,
  unblockCardByIdApi,
  resendActivationApi,
  proCardByIdApi,
  unproCardByIdApi
} from "@/api/card-api";
import { beConfig } from "@/configs/backend";

//Set the user role that should have access to this page
const userAccessRole = 1;

function ViewCards() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [cardInfo, setCardInfo] = useState(false);
  const [cardLink, setCardLink] = useState("");
  const [showModal, setShowModal] = useState(0);
  const [errorMessage, setErroMessage] = useState("");

  const router = useRouter();

  // console.log('cardInfo: ' + JSON.stringify(cardInfo));

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getCardInfoByCardLink = async (cardLinkScoped) => {
    const cardInfoTemp = await getCardInfoByCardLinkApi(cardLinkScoped);
    setCardInfo(cardInfoTemp);
  };

  useEffect(() => {
    if (!router.isReady) return;
    setCardLink(router.query.cardLink);
    accessRule();
    getCardInfoByCardLink(router.query.cardLink);
  }, [router.isReady, router.query.cardLink]);

  const handleBlock = async (e) => {
    e.preventDefault();
    await blockCardByIdApi(cardInfo.card_id);
    getCardInfoByCardLink(router.query.cardLink);
    setShowModal(0);
  };

  const handlePro = async (e) => {
    e.preventDefault();
    await proCardByIdApi(cardInfo.card_id);
    getCardInfoByCardLink(router.query.cardLink);
    setShowModal(0);
  };

  const handleUnpro = async (e) => {
    e.preventDefault();
    await unproCardByIdApi(cardInfo.card_id);
    getCardInfoByCardLink(router.query.cardLink);
    setShowModal(0);
  };

  const handleUnblock = async (e) => {
    e.preventDefault();
    await unblockCardByIdApi(cardInfo.card_id);
    getCardInfoByCardLink(router.query.cardLink);
    setShowModal(0);
  };

  const handleChangeQr = async (e) => {
    e.preventDefault();
    if (
      !e.target.qrFile.files[0] ||
      e.target.qrFile.files[0].size / 1024 > 5120 ||
      ["jpg", "jpeg", "png"].indexOf(
        e.target.qrFile.files[0].name.split(".").pop()
      ) === -1
    ) {
      setErroMessage("Please upload image (jpg/png) below 5MB");
      return false;
    }
    const fileName = cardInfo.qr_code;
    const formData = new FormData();
    formData.append("file", e.target.qrFile.files[0]);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(`${beConfig.host}uploadqr`, formData);
      if (res.data.message === "File Uploaded") {
        setErroMessage("");
        setShowModal(0);
      } else setErroMessage(res.data.message);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleResendActivation = async (e) => {
    e.preventDefault();
    await resendActivationApi(cardInfo.card_link);
    getCardInfoByCardLink(router.query.cardLink);
    setShowModal(0);
  };

  const handleClose = () => {
    setShowModal(0);
    setErroMessage("");
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
        <Row className="w-50">
          <Col md={3} size="sm" className="d-grid gap-2">
            {cardInfo.is_blocked ? (
              <Button variant="success" onClick={(e) => setShowModal(2)}>
                Unblock
              </Button>
            ) : (
              <Button variant="danger" onClick={() => setShowModal(1)}>
                Block
              </Button>
            )}
          </Col>
          <Col md={3} size="sm" className="d-grid gap-2">
            {!cardInfo.is_pro ? (
              <Button variant="warning" onClick={(e) => setShowModal(5)}>
                Enable Pro
              </Button>
            ) : (
              <Button variant="warning" onClick={() => setShowModal(6)}>
                DIsable Pro
              </Button>
            )}
          </Col>
          <Col md={3} size="sm" className="d-grid gap-2">
            <Button variant="warning" onClick={(e) => setShowModal(4)}>
              Change QR
            </Button>
          </Col>
          <Col md={3} size="sm" className="d-grid gap-2">
            {cardInfo.is_confirmed ? (
              ""
            ) : (
              <Button variant="primary" onClick={(e) => setShowModal(3)}>
                Resend Activation
              </Button>
            )}
          </Col>

        </Row>
      ) : (
        <div>You do not have access to this content </div>
      )}

      {/* Block modal */}
      <Modal
        show={showModal && showModal === 1}
        onHide={handleClose}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="admin-edit"
      >
        <Modal.Header closeButton className="px-5 pb-0">
          <Modal.Title>
            <h4 className="m-0" style={{ color: "red" }}>
              CAUTION!
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <p className="mb-3">
            Are you sure you want to block {cardInfo.card_link}?
          </p>
          <div className="d-flex justify-content-end">
            <Button
              variant="danger"
              size="sm"
              className="mx-1"
              onClick={(e) => handleBlock(e)}
            >
              Block
            </Button>
            <Button
              variant="dark"
              size="sm"
              className="mx-1"
              onClick={(e) => setShowModal(0)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Unblock modal */}
      <Modal
        show={showModal && showModal === 2}
        onHide={handleClose}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="admin-edit"
      >
        <Modal.Header closeButton className="px-5 pb-0">
          <Modal.Title>
            <h4 className="m-0" style={{ color: "red" }}>
              CAUTION!
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <p className="mb-3">
            Are you sure you want to unblock {cardInfo.card_link}?
          </p>
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              size="sm"
              className="mx-1"
              onClick={(e) => handleUnblock(e)}
            >
              Unblock
            </Button>
            <Button
              variant="dark"
              size="sm"
              className="mx-1"
              onClick={(e) => setShowModal(0)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Resend activation code */}
      <Modal
        show={showModal && showModal === 3}
        onHide={handleClose}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="admin-edit"
      >
        <Modal.Body className="px-5">
          <p className="mb-3">
            Are you sure you want to resend actiation code for{" "}
            {cardInfo.card_link} to <b>{cardInfo.order_email}?</b>
          </p>
          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="primary"
              size="sm"
              className="mx-1"
              onClick={(e) => handleResendActivation(e)}
            >
              Resend
            </Button>
            <Button
              variant="dark"
              size="sm"
              className="mx-1"
              onClick={(e) => setShowModal(0)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Enable Pro modal */}
      <Modal
        show={showModal && showModal === 5}
        onHide={handleClose}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="admin-edit"
      >
        <Modal.Header closeButton className="px-5 pb-0">
          <Modal.Title>
            <h4 className="m-0">
              CAUTION!
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <p className="mb-3">
            Are you sure you want to enable pro services for {cardInfo.card_link}?
          </p>
          <div className="d-flex justify-content-end">
            <Button
              variant="warning"
              size="sm"
              className="mx-1"
              onClick={(e) => handlePro(e)}
            >
              Enable Pro
            </Button>
            <Button
              variant="dark"
              size="sm"
              className="mx-1"
              onClick={(e) => setShowModal(0)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Disable Pro modal */}
      <Modal
        show={showModal && showModal === 6}
        onHide={handleClose}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="admin-edit"
      >
        <Modal.Header closeButton className="px-5 pb-0">
          <Modal.Title>
            <h4 className="m-0">
              CAUTION!
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <p className="mb-3">
            Are you sure you want to disable pro services for {cardInfo.card_link}?
          </p>
          <div className="d-flex justify-content-end">
            <Button
              variant="warning"
              size="sm"
              className="mx-1"
              onClick={(e) => handleUnpro(e)}
            >
              Disable Pro
            </Button>
            <Button
              variant="dark"
              size="sm"
              className="mx-1"
              onClick={(e) => setShowModal(0)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Change QR code */}
      <Modal
        show={showModal && showModal === 4}
        onHide={handleClose}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="admin-edit"
      >
        <Modal.Header closeButton className="px-5 pb-0">
          <Modal.Title>
            <h4 className="m-0" style={{ color: "dodgerblue" }}>
              CHANGE QR CODE
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <p className="mb-3">
            Please select image of the new QR for {cardInfo.card_link}
          </p>
          <Form onSubmit={(e) => handleChangeQr(e)}>
            <Form.Group controlId="formFileSm" className="mb-3">
              <Form.Label>
                {errorMessage ? (
                  <div className="error-message">{errorMessage}</div>
                ) : (
                  "Select new QR code image"
                )}
              </Form.Label>
              <Form.Control type="file" name="qrFile" size="sm" />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="warning"
                size="sm"
                type="submit"
                disabled={errorMessage !== ""}
              >
                Upload
              </Button>
              <Button
                variant="dark"
                size="sm"
                className="mx-1"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ViewCards;
