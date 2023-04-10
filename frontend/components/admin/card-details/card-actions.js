import React, { useState } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";

import { Icon } from "@/components/_App/Icon";
import { beConfig } from "@/configs/backend";
import ActionSetter from "./action-setter";
import {
  getActionByIdApi,
  addActionApi,
  modActionApi,
  defaultActionApi,
  getDefaultActionApi,
  getActionListApi
} from "@/api/action-api";
import FileUpload from "./file-upload";

// const actionsList = await getActionListApi();

const actionsList = [
  { actionTypeId: 2, actionName: "Contact Vcard", actionIcon: "FaAddressBook" },
  {
    actionTypeId: 3,
    actionName: "Contact Profile",
    actionIcon: "FaAddressCard",
  },
  {
    actionTypeId: 4,
    actionName: "Custom URL",
    actionIcon: "FaExternalLinkSquareAlt",
  },
  { actionTypeId: 5, actionName: "Whatsapp", actionIcon: "FaWhatsappSquare" },
  { actionTypeId: 6, actionName: "Call to Phone", actionIcon: "FaPhoneSquareAlt" },
  { actionTypeId: 7, actionName: "Send SMS", actionIcon: "FaSms" },
  { actionTypeId: 8, actionName: "Link Tree", actionIcon: "FaTree" },
];

function CardActions({ cardDetail, defaultType }) {
  const [allAboutCard, setAllAboutCard] = useState(cardDetail);
  const [allAboutAction, setAllAboutAction] = useState([]);
  const [defaultAction, setDefaultAction] = useState(
    defaultType?.action_type_id
  );
  const [showModal, setShowModal] = useState(0);
  const [value, setValue] = useState("");
  const [treeValues, setTreeValues] = useState([]);
  const [image, setImage] = useState("");
  const [isNew, setIsNew] = useState(1);
  const [actionName, setActionName] = useState("");
  const [whichAction, setWhichAction] = useState(3);
  const [aboutMe, setAboutMe] = useState('');
  // let vcardDetail = {};

  let {
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
    action_type_id,
  } = allAboutCard[0];

  const handleClose = () => {
    setShowModal(false);
    setValue("");
    setAboutMe("");
    setTreeValues([]);
    setImage("")
  };

  const handleActionClick = async (actionTypeId, isAdd, actionId) => {
    const singleActionData = !isAdd ? await getActionByIdApi(actionId) : null;
    if (actionTypeId === 8 && singleActionData)
      setTreeValues(singleActionData.link_attribute);
    setAllAboutAction(singleActionData);
    setActionName(singleActionData?.action_tag);
    setValue(
      actionTypeId === 8 && singleActionData
        ? singleActionData?.display_name
        : singleActionData?.action_attribute
    );
    setAboutMe(
      actionTypeId === 8 && singleActionData
        ? singleActionData?.about_me
        : ""
    );

    setImage(
      [2,3,8].includes(actionTypeId) && singleActionData ? singleActionData.image_file : ""
    );
    setIsNew(isAdd);
    setWhichAction(actionTypeId)
    setShowModal(actionTypeId);
  };

  return (
    <>
      <Container className="px-0 mt-5 min-vh-50">

        {allAboutCard.length===1 && !allAboutCard[0].action_id ? 
        <p className="text-center my-5">The users haven&apos;t added any action yet.</p> : 
        <Row className="my-3 p-0">
          {allAboutCard.map(
            ({
              action_name,
              action_id,
              action_type_id,
              active_action,
              action_tag,
              action_attribute,
              action_icon,
            }) => (
              <Col
                key={action_id}
                lg={6} xl={4}
                className="my-2 px-0 d-flex justify-content-around"
              >
                <Row className="m-0 p-0">
                  <Col xs={2} className="d-flex align-items-center justify-content-end m-0 p-0">
                  {action_icon ? <Icon nameIcon={action_icon} propsIcon={{ size: 36, color: "#dfdfde" }} /> : ""}
                  </Col>
                  <Col xs={10}>
                    <button
                      className="btn-reveal"
                      onClick={() =>
                        handleActionClick(action_type_id, 0, action_id)
                      }
                    >
                      <span className="new">{action_attribute}</span>
                      <div className= {active_action===action_id ? "old old-default": "old"}>
                        <span>
                          {action_tag ? action_tag : action_name}
                        </span>
                        <span aria-hidden>
                          {action_tag ? action_tag : action_name}
                        </span>
                      </div>
                    </button>
                  </Col>
                </Row>


              </Col>
            )
          )}
        </Row>}
      </Container>

      <ActionSetter
        showModal={showModal}
        setShowModal={setShowModal}
        handleClose={handleClose}
        value={value}
        setValue={setValue}
        allAboutAction={allAboutAction}
        setDefaultAction={setDefaultAction}
        card_id={card_id}
        card_link={card_link}
        allAboutCard={allAboutCard}
        setAllAboutCard={setAllAboutCard}
        isNew={isNew}
        isDefault={allAboutAction?.action_id===allAboutCard[0].active_action}
        actionName={actionName}
        setActionName={setActionName}
        whichAction={whichAction}
        image={image}
        setImage={setImage}
        treeValues={treeValues}
        setTreeValues={setTreeValues}
        aboutMe={aboutMe}
        setAboutMe={setAboutMe}
      />
    </>
  );
}

export default CardActions;
