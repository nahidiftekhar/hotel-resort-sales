import React, { useEffect, useState } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";
import Link from "next/link";

import { Icon } from "@/components/_App/Icon";
import authorizeAccess from "./api/auth-api";
import listCardApi from "./api/list-card-api";

//Set the user role that should have access to this page
const userAccessRole = 0;

export default function Home() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState();
  const [cardList, setCardList] = useState();

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult?.success);
    setUserDetails(authResult);
    if (authResult?.success === true) {
      getCardList(authResult?.message.userId);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
      else setIsLoading(false);
  };

  const getCardList = async (userId) => {
    setCardList(await listCardApi(userId));
  };

  useEffect(() => {
    accessRule();
  }, []);

  if (accessGranted === 100 || isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-70 p-0">
      <div className="home-main">
        {accessGranted ? (
          <div className="w-100">
            <Row className="mb-4">
              <Col xs={6} className="d-flex align-items-end">
                <h5>My Cards:</h5>
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
            {!cardList ? (
              <p>You have no cards yet</p>
            ) : (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Card</th>
                    {/* <th>Card User</th>
                  <th>Card Status</th> */}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cardList.map((card) => (
                    <tr key={card.card_link}>
                      <td>
                        <div className="card-tag">
                          <span>Name: </span>
                          {card.card_tag ? card.card_tag : "-"}
                        </div>
                        <div className="card-link">
                          <span>Link: </span>
                          {card.card_link}
                        </div>
                      </td>
                      {/* <td>{card.card_tag ? card.card_tag : "-"}</td>
                    <td>{card.is_active ? (card.is_blocked ? "Blocked" : "Active") : "Inactive"}</td> */}
                      <td>
                        <div className="button-gradient-1">
                          <Link
                            href={{
                              pathname: "/card-view",
                              query: { cardLink: card.card_link },
                            }}
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        ) : (
          // <div>You do not have access to this content </div>
          <PropagateLoader color="#0860ae" size={10} />
        )}
      </div>
    </Container>
  );
}
