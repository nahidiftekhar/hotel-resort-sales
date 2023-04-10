import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

import authorizeAccess from "@/api/auth-api";

//Set the user role that should have access to this page
const userAccessRole = 1;

function ViewCards() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
    <Container className="d-flex align-items-center justify-content-center min-vh-70">
      {accessGranted ? (<div>you have access</div>)
      : (
        <div>You do not have access to this content </div>
      )}
    </Container>
  );
}

export default ViewCards;
