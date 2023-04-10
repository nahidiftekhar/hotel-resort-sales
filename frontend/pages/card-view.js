import React, { useState, useEffect } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";

import getCardDetails from "./api/get-card-api";
import authorizeAccess from "./api/auth-api";
import { getDefaultActionApi } from "@/api/action-api";

import BasicProfile from "@/components/card-view/basic-profile";
import CardActions from "@/components/card-view/card-actions";
import CardStat from "@/components/card-view/card-stat";

//Set the user role that should have access to this page
const userAccessRole = 0;

function CardView() {
  const [key, setKey] = useState("1");
  const [cardDetail, setCardDetail] = useState();
  const [defaultAction, setDefaultAction] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const accessRule = async (userId) => {
    const authResult = await authorizeAccess(userAccessRole);
    setTimeout(() => {
      setAccessGranted(authResult.success && authResult.message.userId === userId);
      setIsLoading(false)
    }, 2000);
  };

  const router = useRouter();
  const { cardLink } = router.query;

  const cardDetails = async (cardLink) => {
    const allThingsCard = await getCardDetails(cardLink);
    setCardDetail(allThingsCard);
    await accessRule(allThingsCard[0].user_id)
    setDefaultAction(await getDefaultActionApi(allThingsCard[0].active_action))
  };

  useEffect(() => {
    if (!router.isReady) return;
    cardDetails(cardLink);
  }, [router.isReady]);

  if (isLoading)
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-70">
      <PropagateLoader color="#0860ae" size={10} />
    </Container>
  );

  if (!accessGranted) return <Container className="d-flex justify-content-center align-items-center min-vh-70">You do not have access to this content </Container>;

  return (
    <Container className="card-view p-0">
      <div className="card-box">
        <h5 className="text-center mb-4">Card ID: {cardLink}</h5>
        <Tab.Container mountOnEnter id="controlled-tab-example" activeKey={key}>
          <Nav variant="pills" className="d-flex justify-content-center mt-3 mb-3">
            <Nav.Item>
              <Nav.Link eventKey="1" onClick={(e) => setKey("1")}>
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="2" onClick={(e) => setKey("2")} >
                Actions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="3" onClick={(e) => setKey("3")}>Statistics</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="1" title="Basic Profile">
              <BasicProfile cardDetail={cardDetail} setKey={setKey} />
            </Tab.Pane>
            <Tab.Pane eventKey="2" title="Action Settings">
              <CardActions cardDetail={cardDetail} defaultType={defaultAction} />
            </Tab.Pane>
            <Tab.Pane eventKey="3" title="Statistics">
              {cardDetail[0].is_pro? <CardStat cardId={cardDetail[0].card_id} /> :
              <Container className="text-center min-vh-50 d-flex align-items-center justify-content-center">This feature is a paid service, please contact us at <a href="mailto:support@smarttaps.co">support@smarttaps.co</a> for more information</Container>}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Container>
  );
}

export default CardView;
