import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Accordion,
} from "react-bootstrap";
import PhoneInput from "react-phone-number-input";

import { Icon } from "@/components/_App/Icon";
import {
  getActionApi,
  addActionApi,
  modActionApi,
  defaultActionApi,
  getDefaultActionApi,
  deleteActionByIdApi,
} from "@/api/action-api";
import getCardDetails from "@/api/get-card-api";
import FileUpload from "./file-upload";

const ActionSetter = (props) => {
  const {
    showModal,
    handleClose,
    value,
    setValue,
    allAboutAction,
    setShowModal,
    setDefaultAction,
    card_id,
    card_link,
    allAboutCard,
    setAllAboutCard,
    isNew,
    isDefault,
    actionName,
    setActionName,
    whichAction,
    image,
    setImage,
    treeValues,
    setTreeValues,
    aboutMe,
    setAboutMe,
  } = props;

  // var { vcardDetail } = props;

  const [vcardDetail, setVcardDetail] = useState({});
  const [profileDetail, setProfileDetail] = useState({});
  const [profileTheme, setProfileTheme] = useState("#1e91cf");

  useEffect(() => {
    setProfileDetail(allAboutAction);
    setProfileTheme(allAboutAction.theme_element?.baseColor ? allAboutAction.theme_element?.baseColor : "#1e91cf")
    setVcardDetail(
      allAboutAction?.vcard_attribute ? allAboutAction?.vcard_attribute : {}
    );
    if (allAboutAction && allAboutAction.action_type_id === 3)
      setTreeValues(allAboutAction.other_info);
  }, [allAboutAction]);

  const handleProfileChange = (e) => {
    let newDetail = {};
    newDetail[e.target.name] = e.target.value;
    setProfileDetail((profileDetail) => ({
      ...profileDetail,
      ...newDetail,
    }));
  };

  const handleVcardChange = (e) => {
    // vcardDetail[e.target.name] = e.target.value;
    let newDetail = {};
    newDetail[e.target.name] = e.target.value;
    setVcardDetail((vcardDetail) => ({
      ...vcardDetail,
      ...newDetail,
    }));
  };

  const deleteAction = async (actionId) => {
    const result = await deleteActionByIdApi(actionId);
    if (result) {
      setAllAboutCard(await getCardDetails(card_link));
      setShowModal(10);
      setTimeout(() => {
        setShowModal(0);
      }, 2000);
      setValue("");
      setActionName("");
      // setDefaultAction(actionTypeId);
    }
  };

  const makeDefaultAction = async (actionId, cardId, actionTypeId) => {
    const result = await defaultActionApi(cardId, actionId);
    if (result) {
      setAllAboutCard(await getCardDetails(card_link));
      setShowModal(10);
      setTimeout(() => {
        setShowModal(0);
      }, 2000);
      setValue("");
      setActionName("");
      setDefaultAction(actionTypeId);
    }
  };

  const modifyAction = async (actionId, actionTypeId, actionAttribute) => {
    switch (actionTypeId) {
      case 8:
        actionAttribute = {
          attributes: treeValues,
          displayName: value,
          image: image,
          aboutMe: aboutMe,
          themeElement: profileTheme
        };
        break;
      case 2:
        actionAttribute = {
          attributes: vcardDetail,
          image: image,
        };
        break;
      case 3:
        profileDetail["free_links"] = treeValues;
        profileDetail["theme_element"] = {baseColor: profileTheme}
        actionAttribute = {
          attributes: profileDetail,
          image: image,
        };
        break;
    }
    const result = await modActionApi(
      actionId,
      card_id,
      actionTypeId,
      actionAttribute,
      actionName
    );
    if (result) {
      setAllAboutCard(await getCardDetails(card_link));
      setShowModal(10);
      setTimeout(() => {
        setShowModal(0);
      }, 2000);
      setValue("");
      setAboutMe("");
      setProfileTheme("#1e91cf")
      setActionName("");
      setVcardDetail({});
    }
  };

  const addAction = async (actionTypeId, actionAttribute) => {
    switch (actionTypeId) {
      case 8:
        actionAttribute = {
          attributes: treeValues,
          displayName: value,
          image: image,
          aboutMe: aboutMe,
          themeElement: profileTheme
        };
        break;
      case 2:
        actionAttribute = {
          attributes: vcardDetail,
          image: image,
        };
        break;
      case 3:
        profileDetail["free_links"] = treeValues;
        profileDetail["theme_element"] = {baseColor: profileTheme}
        actionAttribute = {
          attributes: profileDetail,
          image: image,
        };
        break;
    }
    const result = await addActionApi(
      card_id,
      actionTypeId,
      actionAttribute,
      actionName
    );
    if (result) {
      setAllAboutCard(await getCardDetails(card_link));
      setShowModal(10);
      setTimeout(() => {
        setShowModal(0);
      }, 2000);
      setValue("");
      setAboutMe("");
      setActionName("");
      setVcardDetail({});
      setProfileTheme("#1e91cf")
      if (allAboutCard.length === 1 && !allAboutCard[0].action_id) {
        makeDefaultAction(
          result.action_id,
          result.card_id,
          result.action_type_id
        );
      }
    }
  };

  const renderHeader = (actionTypeId) => {
    switch (actionTypeId) {
      case 2:
        return "CONFIGURE YOUR CONTACT VCARD";
      case 3:
        return "CONFIGURE YOUR CONTACT PROFILE";
      case 4:
        return "CONFIGURE YOUR CUSTOM URL";
      case 5:
        return "CONFIGURE YOUR WHATSAPP NUMBER";
      case 6:
        return "CONFIGURE YOUR PHONE NUMBER";
      case 7:
        return "CONFIGURE NUMBER FOR SMS";
      case 8:
        return "CONFIGURE YOUR LINK TREE";
      default:
        return "CONFIGURE YOUR ACTION";
    }
  };

  const renderActionDesctiption = (actionTypeId) => {
    switch (actionTypeId) {
      case 2:
        return "Your contacts will be able to save your information in their contactlist.";
      case 3:
        return "Your contacts will your profile when they scan your card.";
      case 4:
        return "Your contacts will be redirected to this URL when they scan your card.";
      case 5:
        return "Your contacts will send message to this whatsapp when they scan your card.";
      case 6:
        return "Your contacts will call this number when they scan your card.";
      case 7:
        return "Your contacts will send text message to this number when they scan your card.";
      case 8:
        return "Your contacts will view this link tree when they scan your card.";
      default:
        return "Your contacts will perform the action when they scan your card.";
    }
  };

  const renderSwitch = (actionTypeId) => {
    switch (actionTypeId) {
      case 4:
        return (
          <Form.Group controlId="customUrl" className="my-3">
            <Form.Label>URL Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="www.yourlink.com"
              readOnly
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Form.Group>
        );

      case 5:
        return (
          <div>
            <PhoneInput
              placeholder="Enter whatsapp number"
              value={value}
              onChange={setValue}
              readOnly
              className="my-2 me-5 border-lt"
            />
            <label>Example: +971XXXXXXXX</label>
          </div>
        );

      case 6:
        return (
          <div>
            <PhoneInput
              placeholder="Enter phone number"
              value={value}
              onChange={setValue}
              readOnly
              className="my-2 me-5 border-lt"
            />
            <label>Example: +971XXXXXXXX</label>
          </div>
        );

      case 7:
        return (
          <div>
            <PhoneInput
              placeholder="Enter phone number"
              readOnly
              value={value}
              onChange={setValue}
              className="my-2 me-5 border-lt"
            />
            <label>Example: +971XXXXXXXX</label>
          </div>
        );

      default:
        return (
          <Form.Group controlId="customUrl" className="my-3">
            <Form.Label>We are not sure yet</Form.Label>
            <Form.Control
              type="text"
              placeholder="www.yourlink.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Form.Group>
        );
    }
  };

  let handleChange = (i, e) => {
    let newtreeValues = [...treeValues];
    newtreeValues[i][e.target.name] = e.target.value;
    setTreeValues(newtreeValues);
  };

  let addFormFields = (isAction) => {
    setTreeValues([
      ...treeValues,
      { label: "", link: "", is_action: isAction },
    ]);
  };

  let removeFormFields = (i) => {
    let newtreeValues = [...treeValues];
    newtreeValues.splice(i, 1);
    setTreeValues(newtreeValues);
  };

  return (
    <div>
      {/*Modal for SMS, Phone, Whatsapp, Custom URL */}
      <Modal
        show={
          whichAction >= 4 && whichAction <= 7 && showModal && showModal < 10
        }
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName=""
      >
        <Modal.Body className="px-5">
          <Form>
            <Form.Group controlId="actionName" className="my-3">
              <Form.Label>Action Name</Form.Label>
              <Form.Control
                type="text"
                readOnly disabled
                placeholder="Only you can see this name"
                value={actionName}
                onChange={(e) => setActionName(e.target.value)}
              />
            </Form.Group>

            {renderSwitch(whichAction)}
          </Form>
        </Modal.Body>
      </Modal>

      {/*Modal for link tree*/}
      <Modal
        show={whichAction === 8 && showModal && showModal < 10}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName=""
      >
        <Modal.Body className="px-5">
          <Form>
            <Row>
              <Col md={4}>
                <FileUpload
                  cardId={card_id}
                  setImage={setImage}
                  imageFile={image}
                />
              </Col>
              <Col md={6}>
                <Form.Group controlId="actionName" className="my-3">
                  <Form.Label>Action Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Only you can see this name"
                    value={actionName}
                    disabled
                    onChange={(e) => setActionName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={value}
                    readOnly
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Group controlId="aboutme" className="">
                  <Form.Label>About Yourself</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="You may write something about yourself"
                    value={aboutMe}
                    readOnly
                    onChange={(e) => setAboutMe(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {treeValues.map((element, index) => (
              <Row
                key={index}
                className="align-items-end my-3 pb-2 border-bottom"
              >
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Label</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Label for link"
                      name="label"
                      value={element.label}
                      readOnly
                      onChange={(e) => handleChange(index, e)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {element.is_action ? (
                    <Form.Group>
                      <Form.Label>
                        Please select the action you want to assign
                      </Form.Label>
                      <Form.Select
                        aria-label="select-predefined-action"
                        size="sm"
                        name="link"
                        disabled
                        defaultValue={element.link}
                        onChange={(e) => handleChange(index, e)}
                      >
                        <option className="select-disabled">
                          Select Action
                        </option>
                        {allAboutCard.map(({ action_id, action_tag }) => (
                          <option
                            key={action_id}
                            value={action_id}
                            // selected={element.link === action_id}
                          >
                            {action_tag}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Form.Group>
                      <Form.Label>
                        Link (don&apos;t add http or https in front)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="www.yourlink.com"
                        name="link"
                        readOnly
                        value={element.link}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Form.Group>
                  )}
                </Col>
              </Row>
            ))}
          </Form>
        </Modal.Body>
      </Modal>

      {/*vCard Modal*/}
      <Modal
        show={whichAction === 2 && showModal && showModal < 10}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="vcard-setter"
      >
        <Modal.Body className="px-5">
          <Form>
            <Row className="section-box">
              <Col md={4}>
                <FileUpload
                  cardId={card_id}
                  setImage={setImage}
                  imageFile={image}
                />
              </Col>
              <Col md={8}>
                <Form.Group controlId="actionName" className="mb-3">
                  <Form.Label>Action Name</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Only you can see this name"
                    value={actionName}
                    readOnly
                    onChange={(e) => setActionName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Your first name"
                    name="firstName"
                    readOnly
                    value={vcardDetail?.firstName}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Your last name"
                    name="lastName"
                    readOnly
                    value={vcardDetail?.lastName}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Prefix</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Mr./Ms/Dr etc"
                    name="namePrefix"
                    readOnly
                    value={vcardDetail?.namePrefix}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="M/F"
                    name="gender"
                    readOnly
                    value={vcardDetail?.gender}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="section-box">
              <Col md={6} className="mb-4">
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Primary phone</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Home phone number"
                    name="homePhone"
                    readOnly
                    value={vcardDetail?.homePhone}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-4">
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Primary email ID"
                    name="email"
                    readOnly
                    value={vcardDetail?.email}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Organization/Company</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Organization/company name"
                    name="organization"
                    readOnly
                    value={vcardDetail?.organization}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group controlId="formBasicEmail" className="">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Professional title"
                    name="title"
                    readOnly
                    value={vcardDetail?.title}
                    onChange={(e) => handleVcardChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="section-box">
              <Accordion flush className="p-0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="p-0">
                    Other Phones
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="section-box m-0">
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Work phone</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Work phone number"
                            name="workPhone"
                            readOnly
                            value={vcardDetail?.workPhone}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Mobile phone</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Mobile phone number"
                            name="cellPhone"
                            readOnly
                            value={vcardDetail?.cellPhone}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Pager</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Pager number"
                            name="pagerPhone"
                            readOnly
                            value={vcardDetail?.pagerPhone}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Fax</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Fax number"
                            name="homeFax"
                            readOnly
                            value={vcardDetail?.homeFax}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className="section-box">
              <Accordion flush className="p-0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="p-0">Web</Accordion.Header>
                  <Accordion.Body>
                    <Row className="section-box m-0">
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Work email</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Work email"
                            name="workEmail"
                            readOnly
                            value={vcardDetail?.workEmail}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Secondary email</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Secondary email"
                            name="secondEmail"
                            readOnly
                            value={vcardDetail?.secondEmail}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Website</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Personal website"
                            name="url"
                            readOnly
                            value={vcardDetail?.url}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Work website</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Work website"
                            name="workUrl"
                            readOnly
                            value={vcardDetail?.workUrl}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className="section-box">
              <Accordion flush className="p-0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="p-0">
                    Home Address
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="section-box m-0">
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Address Label</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Home address label"
                            name="homeAddress.label"
                            readOnly
                            value={vcardDetail?.["homeAddress.label"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Full Address</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Address"
                            name="homeAddress.street"
                            readOnly
                            value={vcardDetail?.["homeAddress.street"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="City"
                            name="homeAddress.city"
                            readOnly
                            value={vcardDetail?.["homeAddress.city"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="State/province"
                            name="homeAddress.stateProvince"
                            readOnly
                            value={vcardDetail?.["homeAddress.stateProvince"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Postal code"
                            name="homeAddress.postalCode"
                            readOnly
                            value={vcardDetail?.["homeAddress.postalCode"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Country"
                            name="homeAddress.countryRegion"
                            readOnly
                            value={vcardDetail?.["homeAddress.countryRegion"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className="section-box">
              <Accordion flush className="p-0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="p-0">
                    Work Address
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="section-box m-0">
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Address Label</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Home address label"
                            name="workAddress.label"
                            readOnly
                            value={vcardDetail?.["workAddress.label"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Full Address</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            readOnly
                            placeholder="Address"
                            name="workAddress.street"
                            value={vcardDetail?.["workAddress.street"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            readOnly
                            placeholder="City"
                            name="workAddress.city"
                            value={vcardDetail?.["workAddress.city"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            readOnly
                            placeholder="State/province"
                            name="workAddress.stateProvince"
                            value={vcardDetail?.["workAddress.stateProvince"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            readOnly
                            placeholder="Postal code"
                            name="workAddress.postalCode"
                            value={vcardDetail?.["workAddress.postalCode"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="formBasicEmail" className="">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            readOnly
                            placeholder="Country"
                            name="workAddress.countryRegion"
                            value={vcardDetail?.["workAddress.countryRegion"]}
                            onChange={(e) => handleVcardChange(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/*Profile Modal*/}
      <Modal
        show={whichAction === 3 && showModal && showModal < 10}
        onHide={() => {
          setProfileDetail({});
          handleClose();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="vcard-setter"
      >
        <Modal.Body className="px-5">
          <Form>
            <Row className="section-box">
              <Col md={4} className="">
                <FileUpload
                  cardId={card_id}
                  setImage={setImage}
                  imageFile={image}
                />
              </Col>
              <Col md={8}>
                <Form.Group controlId="actionName" className="mb-2">
                  <Form.Label>Action Name</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="Only you can see this name"
                    value={actionName}
                    onChange={(e) => setActionName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="my-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="Your full name"
                    name="name"
                    // value={profileDetail.name ? profileDetail.name : profileDetail?.basic_info?.name}
                    value={profileDetail?.name}
                    onChange={(e) => handleProfileChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className="my-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    readOnly
                    // type="text"
                    size="sm"
                    placeholder="Full address"
                    name="address"
                    value={profileDetail?.address}
                    onChange={(e) => handleProfileChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formBasicEmail" className="my-2">
                  <Form.Label>About Me</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="A paragraph about yourself"
                    name="aboutme"
                    value={profileDetail?.aboutme}
                    onChange={(e) => handleProfileChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicEmail" className="my-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="Personal identity/Job title"
                    name="title"
                    value={profileDetail?.title}
                    onChange={(e) => handleProfileChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicEmail" className="my-2">
                  <Form.Label>Organization/Company</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="Organization/company"
                    name="organization"
                    value={profileDetail?.organization}
                    onChange={(e) => handleProfileChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="section-box my-3 py-3 d-flex align-items-center">
              <Col md={6} className="text-end pe-3">
                <h6 className="m-0">Select vCard for sharing</h6>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Select
                    disabled
                    aria-label="select-predefined-action"
                    size="sm"
                    // defaultValue={profileDetail?.vcard_id}
                    name="vcard_id"
                    onChange={(e) => handleProfileChange(e)}
                  >
                    <option value="0" className="select-disabled">
                      Select vCard
                    </option>
                    {allAboutCard
                      .filter((obj) => obj.action_type_id === 2)
                      .map(({ action_id, action_tag }) => (
                        <option
                          key={action_id}
                          value={action_id}
                          selected={profileDetail?.vcard_id === action_id}
                        >
                          {action_tag}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="section-box">
              <h5>Direct contact information</h5>
              <Col md={6} className="my-2">
                <Form.Group controlId="phone" className="">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="Phone number in international format"
                    name="contactphone"
                    value={profileDetail?.contactphone}
                    onChange={(e) => handleProfileChange(e)}
                  />
                  <label className="smaller-label">Example: +971XXXXXXXX</label>
                </Form.Group>
              </Col>
              <Col md={6} className="my-2">
                <Form.Group controlId="phone" className="">
                  <Form.Label>Whatsapp</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    readOnly
                    placeholder="whatsapp number in international format"
                    name="contactwhatsapp"
                    value={profileDetail?.contactwhatsapp}
                    onChange={(e) => handleProfileChange(e)}
                  />
                  <label className="smaller-label">Example: +971XXXXXXXX</label>
                </Form.Group>
              </Col>
              <Col md={6} className="my-2">
                <Form.Group controlId="phone" className="">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    size="sm"
                    readOnly
                    placeholder="Email ID"
                    name="contactemail"
                    value={profileDetail?.contactemail}
                    onChange={(e) => handleProfileChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="my-2">
                <Form.Label className="mb-2">Location</Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  readOnly
                  placeholder="Maps link"
                  name="contactfb"
                  value={profileDetail?.contactfb}
                  onChange={(e) => handleProfileChange(e)}
                />
              </Col>
            </Row>

            <div className="section-box">
              {treeValues.map((element, index) => (
                <Row key={index} className="align-items-end mx-0 my-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Label</Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        readOnly
                        placeholder="Label for link"
                        name="label"
                        value={element.label}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {element.is_action === 1 ? (
                      <Form.Group>
                        <Form.Select
                          disabled
                          aria-label="select-predefined-action"
                          size="sm"
                          name="link"
                          defaultValue={element.link}
                          onChange={(e) => handleChange(index, e)}
                        >
                          <option className="select-disabled">
                            Select Action
                          </option>
                          {allAboutCard.map(({ action_id, action_tag }) => (
                            <option
                              key={action_id}
                              value={action_id}
                              // selected={element.link === action_id}
                            >
                              {action_tag}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    ) : element.is_action === 2 ? (
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          as="textarea"
                          rows={2}
                          size="sm"
                          placeholder="Describe yourself"
                          name="link"
                          value={element.link}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </Form.Group>
                    ) : (
                      <Form.Group>
                        <Form.Control
                          type="text"
                          size="sm"
                          readOnly
                          placeholder="www.yourlink.com"
                          name="link"
                          value={element.link}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </Form.Group>
                    )}
                  </Col>
                  <Col md={2}>
                  </Col>
                </Row>
              ))}
            </div>
          </Form>

          <label>Theme: {profileTheme==='#1e1e1e' ? 'DARK' : 'BLUE'}</label>

        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showModal === 10}
        onHide={handleClose}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName=""
      >
        <Modal.Body className="p-5 text-center">
          Your action is updated successfully.
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" size="sm" onClick={() => handleClose()}>
            OK!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActionSetter;
