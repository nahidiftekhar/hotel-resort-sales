import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";
import axios from "axios";
import fileDownload from "js-file-download";
import {
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

import { Icon } from "@/components/_App/Icon";
import { beConfig } from "@/configs/backend";
import editSingleCard from "@/api/edit-single-card-api";
import { getActionTypeApi, getDefaultActionDetailApi } from "@/api/action-api";
import {getCardInfoByCardLinkApi} from "@/api/card-api"

function BasicProfile({ cardDetail, setKey }) {
  const [cardTag, setCardTag] = useState("");
  const [cardLink, setCardLink] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [cardInfo, setCardInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [defaultActionName, setDefaultActionName] = useState("");

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
    qr_code,
  } = cardDetail ? cardDetail[0] : [];

  useEffect(() => {
    setCardTag(card_tag ? card_tag : username);
    setCardLink(card_link);
    setIsActive(is_active);
    actionName(card_id);
    getCardInfoByCardLink();
  }, [card_link, card_tag, is_active, username]);

  const actionName = async (cardId) => {
    // const tempAction = await getActionTypeApi(actionId);
    const tempAction = await getDefaultActionDetailApi(cardId);
    setDefaultActionName(tempAction);
  };

  const getCardInfoByCardLink = async () => {
    const cardInfoTemp = await getCardInfoByCardLinkApi(card_link);
    setCardInfo(cardInfoTemp);
  }

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
    const imageFile = await axios.get(
      `${beConfig.host}static/images/qr/${qr_code}`,
      {
        responseType: "blob",
      }
    );
    fileDownload(imageFile.data, "qr_code.png");
  };

  if (isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <PropagateLoader color="#36d7b7" size={10} />
      </Container>
    );

  return (
    <Container className="basic-profile">
      <Row className="my-3">
        <Col md={4} className="basic-preview">
          <div className="d-flex lign-items-center justify-content-start">
            <img
              src={`${beConfig.host}static/images/qr/${cardInfo?.qr_code}`}
              height="150px"
            />
          </div>

          <div className="my-3">
            <label>Current Action: </label>
            <div className="bold-text">
              {defaultActionName
                ? defaultActionName.action_name
                : "Not configured"}
            </div>
          </div>
          <div className="my-3">
            <label>Card Status: </label>
            <div
              className="bold-text mb-2"
              // style={{ color: cardInfo?.is_active ? "green" : "red" }}
              style={{color: cardInfo?.is_active ? (cardInfo?.is_confirmed ? "green" : "orange") : "red"}}
            >
              {cardInfo?.is_active ? (cardInfo?.is_confirmed ? "Active" : "Inactive") : "Deactivated by user"}
            </div>
          </div>

          <div className="my-3">
            <label>Block Status: </label>
            <div
              className="bold-text mb-2"
              style={{ color: !cardInfo?.is_blocked ? "green" : "red" }}
            >
              {!cardInfo?.is_blocked ? "Unblocked" : "Blocked"}
            </div>
          </div>

          <div className="share-div d-flex justify-content-start align-items-center gap-1 my-3">
            <a
              href={`${cardInfo?.group_link}${cardInfo?.card_link}`}
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

            <a
              href={`/admin/edit-card?cardLink=${cardLink}`}
              className="btn btn-sm btn-outline-primary"
            >
              <span className="me-2">Edit Card</span>
              <Icon
                nameIcon="FaEdit"
                propsIcon={{ size: 16, color: "#1e5fbf" }}
              />
            </a>

          </div>
        </Col>

        <Col md={8}>
          <Row className="">
            <Col md={6}>
              <div>
                <label>Card ID</label>
                <div className="link-display mb-3">{`${cardInfo?.card_link}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Card Link</label>
                <div className="link-display mb-3">{`${cardInfo?.group_link}${cardInfo?.card_link}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Order Reference</label>
                <div className="link-display mb-3">{`${cardInfo?.order_reference}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Activation Code</label>
                <div className="link-display mb-3">{`${cardInfo?.code}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Order Email</label>
                <div className="link-display mb-3">{`${cardInfo?.order_email}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Registration Email</label>
                <div className="link-display mb-3">{`${cardInfo?.registered_email}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Date Created</label>
                <div className="link-display mb-3">{`${cardInfo?.createdAt}`}</div>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label>Date Activated</label>
                <div className="link-display mb-3">{cardInfo?.is_confirmed ? cardInfo?.updatedAt:"-"}</div>
              </div>
            </Col>

          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default BasicProfile;
