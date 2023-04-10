import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function TopNavbar() {
  const [hideNav, setHideNav] = useState(false);
  const [userType, setUserType] = useState(0);
  useEffect(() => {
    setHideNav(window.location.pathname === "/login");
    setUserType(localStorage.getItem("CMUT"))
  }, []);
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" sticky="top">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo.png" alt="Smart-Tap" height={36} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {hideNav ? (
          ""
        ) : userType==='1' ? (
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link className="mx-3" href="/admin/create-card">
                Create Card
              </Nav.Link>
              <Nav.Link className="mx-3" href="/admin/view-cards">
                View Cards
              </Nav.Link>
              <Nav.Link className="mx-3" href="/logout">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          ) : (
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link className="mx-3" href="/">
                Home
              </Nav.Link>
              <Nav.Link className="mx-3" href="/activate-card">
                Add Card
              </Nav.Link>
              <Nav.Link className="mx-3" href="/logout">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}{" "}
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
