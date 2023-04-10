import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Tab, Nav } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

import BasicProfile from "@/components/admin/card-details/basic-profile";
import CardActions from "@/components/admin/card-details/card-actions";

import authorizeAccess from "@/api/auth-api";
import { getCardDetailsApi } from "@/api/card-api";
import { getDefaultActionApi } from "@/api/action-api";

//Set the user role that should have access to this page
const userAccessRole = 1;

function ViewCards() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [cardLink, SetCardLink] = useState("");
  const [key, setKey] = useState("1");
  const [cardDetail, setCardDetail] = useState("");
  const [defaultAction, setDefaultAction] = useState(0);
  const router = useRouter();

  console.log("cardDetails: " + JSON.stringify(cardDetail));

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getCardDetailsFn = async () => {
    const cardDetailsTemp = await getCardDetailsApi(router.query.cardLink);
    setCardDetail(cardDetailsTemp);
    setDefaultAction(
      await getDefaultActionApi(cardDetailsTemp[0].active_action)
    );
  };

  useEffect(() => {
    if (!router.isReady) return;
    accessRule();
    SetCardLink(router.query.cardLink);
    getCardDetailsFn();
  }, [router.isReady]);

  if (accessGranted === 100 || isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-70">
      {accessGranted ? (
        <Container className="card-view p-0">
          <div className="card-box">
            <h5 className="text-center mb-4">Card ID: {cardLink}</h5>
            <Tab.Container
              mountOnEnter
              id="controlled-tab-example"
              activeKey={key}
            >
              <Nav
                variant="pills"
                className="d-flex justify-content-center mt-3 mb-3"
              >
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={(e) => setKey("1")}>
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={(e) => setKey("2")}>
                    Actions
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="1" title="Basic Profile">
                  <BasicProfile cardDetail={cardDetail} setKey={setKey} />
                </Tab.Pane>
                <Tab.Pane eventKey="2" title="Action Settings">
                  <CardActions
                    cardDetail={cardDetail}
                    defaultType={defaultAction}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Container>
      ) : (
        <div>You do not have access to this content </div>
      )}
    </Container>
  );
}

export default ViewCards;
