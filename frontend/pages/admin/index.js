import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

import authorizeAccess from "@/api/auth-api";

//Set the user role that should have access to this page
const userAccessRole = 1;

export default function Home() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setTimeout(() => {
    setIsLoading(false)
    }, 2000);
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
    <Container className="home-main container min-vh-70">
      {accessGranted ? (
        <div>
          <a href="/admin/create-card" className="btn btn-warning">
            Add Card
          </a>
        </div>
      ) : (
        <div>You do not have access to this content </div>
      )}
    </Container>
  );
}
