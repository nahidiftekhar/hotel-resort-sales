import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LogOutButton } from '../auth/auth-buttons';
import { Icon } from '../_commom/Icon';
import ReactiveButton from 'reactive-button';

function TopNavbar({ session }) {
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
              <Nav.Link className="mx-3" href="/actions">
                Actions
              </Nav.Link>
              <Nav.Link className="mx-3" href="/booking">
                Booking
              </Nav.Link>
              <Nav.Link className="mx-3" href="/guests">
                Guests
              </Nav.Link>
              <Nav.Link className="mx-3" href="/purchase">
                Purchase
              </Nav.Link>
              {session.user.usertype === 2 && (
                <Nav.Link className="mx-3" href="/products">
                  Products
                </Nav.Link>
              )}
              <Nav.Link className="mx-3" href="/reports">
                Reports
              </Nav.Link>
              <Nav.Link className="mx-3" href="/hospitality">
                Visit
              </Nav.Link>
              <div className="d-flex">
                <div className="center-flex mx-3">
                  <a
                    href="/settings"
                    className={`reactive-button-wauto ms-md-5 ${
                      session.user.passChangePending ? 'placeholder-glow' : ''
                    }`}>
                    <ReactiveButton
                      buttonState="idle"
                      idleText={
                        <Icon
                          nameIcon="AiFillSetting"
                          propsIcon={{ size: 12 }}
                        />
                      }
                      animation={true}
                      rounded
                      color="dark"
                      className="p-2 bg-gradient placeholder"
                    />
                  </a>
                </div>
                <div className="center-flex ">
                  <LogOutButton />{' '}
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        )}{' '}
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
