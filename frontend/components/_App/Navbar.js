import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LogOutButton } from '../auth/auth-buttons';

function TopNavbar() {
  const [hideNav, setHideNav] = useState(false);
  const [userType, setUserType] = useState(0);
  useEffect(() => {
    setHideNav(window.location.pathname === '/login');
    setUserType(localStorage.getItem('CMUT'));
  }, []);
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" sticky="top">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo.png" alt="Smart-Tap" height={36} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {hideNav ? (
          ''
        ) : (
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end">
            <Nav>
              <Nav.Link className="mx-3" href="/">
                Home
              </Nav.Link>
              <Nav.Link className="mx-3" href="/booking">
                Booking
              </Nav.Link>
              <Nav.Link className="mx-3" href="/products">
                Products
              </Nav.Link>
              <Nav.Link className="mx-3" href="/guests">
                Guests
              </Nav.Link>
              <Nav.Link className="mx-3" href="/actions">
                Actions
              </Nav.Link>
              <Nav.Link className="mx-3" href="/hospitality">
                Hospitality
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}{' '}
        <LogOutButton />
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
