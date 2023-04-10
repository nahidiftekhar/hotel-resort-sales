import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";
import axios from "axios";
import fileDownload from 'js-file-download'
import {
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon
} from "react-share";

import { Icon } from "../_App/Icon";
import { beConfig } from "@/configs/backend";
import editSingleCard from "@/api/edit-single-card-api";
import { getActionTypeApi, getDefaultActionDetailApi } from "@/api/action-api";

function BasicProfile({ cardDetail, setKey }) {
  const [cardTag, setCardTag] = useState("");
  const [cardLink, setCardLink] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [toEdit, setToEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [defaultActionName, setDefaultActionName] = useState("");
  const [showShare, setShowShare] = useState(false);

  const router = useRouter();

  const {
    card_id,
    card_tag,
    username,
    group_link,
    card_link,
    is_active,
    is_blocked,
    action_name,
    view_password,
    active_action,
    qr_code
  } = cardDetail ? cardDetail[0] : [];

  useEffect(() => {
    setCardTag(card_tag ? card_tag : username);
    setCardLink(card_link);
    setIsActive(is_active);
    actionName(card_id);
  }, [card_link, card_tag, is_active, username]);

  const actionName = async (cardId) => {
    // const tempAction = await getActionTypeApi(actionId);
    const tempAction = await getDefaultActionDetailApi(cardId)
    setDefaultActionName(tempAction);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setCardLink(card_link); //Quickfix to disable link modification
    const editResult = await editSingleCard(
      card_id,
      cardTag,
      cardLink,
      isActive
    );
    if (editResult.status) router.reload(window.location.pathname);
    else setErrorMsg(editResult.msg);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleDl = async () => {
    const imageFile = await axios.get(`${beConfig.host}static/images/qr/${qr_code}`, {
      responseType: 'blob',
    });
    fileDownload(imageFile.data, 'qr_code.png')
  }

  if (isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <PropagateLoader color="#36d7b7" size={10} />
      </Container>
    );

  return (
    <Container className="basic-profile">
      <Row className="mw-fixed flex-column-reverse flex-lg-row">
        <Col lg={6}>
          <Form className="card-detail" onSubmit={handleEdit}>
            <Form.Group controlId="formBasicEmail" className="my-3">
              <Form.Label>Card Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={card_tag ? card_tag : username}
                value={cardTag || ""}
                onChange={(e) => setCardTag(e.target.value)}
                readOnly={!toEdit}
                disabled={!toEdit}
              />
            </Form.Group>
            <Row className="mt-4">
              <Col md={6}>
                <label>Current Action</label>
                <div>
                  <span className="bold-text">
                    {defaultActionName
                      ? defaultActionName.action_name
                      : "Not configured"}
                  </span>
                  {toEdit ? (
                    <Button
                      variant="dark"
                      size="sm"
                      disabled={!is_active}
                      className="mt-2 py-0 d-flex align-items-center"
                      onClick={() => setKey("2")}
                    >
                      <span className="me-1">Configure</span>
                      <Icon
                        nameIcon="AiFillInteraction"
                        propsIcon={{ size: 16, color: "#ffffff" }}
                      />
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
              <Col md={6} className="d-flex flex-column card-status">
                <label>Card Status</label>
                <span
                  className="bold-text mb-2"
                  style={{ color: isActive ? "green" : "red" }}
                >
                  {isActive ? "Active" : "Deactive"}
                </span>
                {toEdit ? (
                  <Form.Check
                    defaultChecked={isActive}
                    type="switch"
                    id="custom-switch"
                    label={isActive ? "Deactivate card" : "Activate Card"}
                    onClick={() => setIsActive(!isActive)}
                  />
                ) : (
                  ""
                )}
              </Col>
            </Row>
            <div className="d-flex justify-content-center">
              {toEdit ? (
                <div>
                  <div className="error-message mt-2 text-center">
                    {errorMsg}
                  </div>
                  <Button
                    type="submit"
                    variant="success"
                    size="sm"
                    className="mt-3 me-3 px-3"
                  >
                    <span className="me-2">Update Information</span>
                    <Icon
                      nameIcon="FaCheckSquare"
                      propsIcon={{ size: 16, color: "#ffffff" }}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="mt-3 ms-3 px-3"
                    onClick={() => setToEdit(false)}
                  >
                    <span className="me-2">Cancel Edit</span>
                    <Icon
                      nameIcon="BsFillStopCircleFill"
                      propsIcon={{ size: 16, color: "#ffffff" }}
                    />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-5 px-5"
                  onClick={() => setToEdit(true)}
                >
                  <span className="me-3">Enable Edit</span>
                  <Icon
                    nameIcon="BiEdit"
                    propsIcon={{ size: 20, color: "#ffffff" }}
                  />
                </Button>
              )}
            </div>
          </Form>
        </Col>

        <Col lg={6} className="profile-share">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <img
              src={`${beConfig.host}static/images/qr/${qr_code}`}
              height="150px"
            />
            <Button size="sm" variant="secondary" className="mt-2 mb-3 py-0" onClick={()=>handleDl()}>
              Download QR Code
            </Button>
          </div>
          <div>
            <label>Link</label>
            <div className="link-display mb-3">{`${beConfig.host}${cardLink}`}</div>
          </div>
          <div className="share-div d-flex justify-content-center align-items-center gap-1">
            <Button
              variant="outline-dark"
              size="sm"
              className="py-1 px-3 mx-2 d-flex align-items-center"
              onClick={() => setShowShare(!showShare)}
            >
              <span className="me-2">Share</span>
              <Icon
                nameIcon="FaShareAlt"
                propsIcon={{ size: 16, color: "#5a5a5a" }}
              />
            </Button>

            {showShare ? (
              <div className="share-buttons">

                {/* <a href={`sms:?body=Please visit my personal profile ${beConfig.host}${cardLink}`}> */}
                <a href={`sms:?&body=Please visit my personal profile ${beConfig.host}${cardLink}`}>
                  <Icon nameIcon="FaSms" propsIcon={{size: 32, color: "#0860ae"}} />
                </a>

                <EmailShareButton
                  subject={`${card_tag ? card_tag : username}'s Profile`}
                  body={`Please visit my personal profile : ${card_tag ? card_tag : username}`}
                  url={`${beConfig.host}${cardLink}`}
                  quote={card_tag ? card_tag : username}
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>

                <WhatsappShareButton
                  title={`${card_tag ? card_tag : username}'s Profile`}
                  url={`${beConfig.host}${cardLink}`}
                  quote={card_tag ? card_tag : username}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>

                <LinkedinShareButton
                  title={`${card_tag ? card_tag : username}'s Profile`}
                  summary={`Please visit my personal profile : ${card_tag ? card_tag : username}`}
                  url={`${beConfig.host}${cardLink}`}
                  quote={card_tag ? card_tag : username}
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>

                <div className="align-self-start">
                  <Button
                    size="sm"
                    variant="danger"
                    className="border border-2 rounded-circle text-white fw-bold px-1 py-0"
                    onClick={() => setShowShare(!showShare)}
                  > x </Button>
                </div>
              </div>
            ) : (
              ""
            )}

            <a
              href={`${group_link}${cardLink}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-dark"
            >
              <span className="me-2">Preview</span>
              <Icon
                nameIcon="FaEye"
                propsIcon={{ size: 16, color: "#5a5a5a" }}
              />
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BasicProfile;
