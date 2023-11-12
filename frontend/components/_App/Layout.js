import React from 'react';
import Head from 'next/head';
import Meta from './Meta';
import TopNavbar from './Navbar';
import Footer from './Footer';
import GoTop from './GoTop';
import { Container } from 'react-bootstrap';
import { NextAuthProvider } from 'provider';
import ChangePassword from 'pages/auth/change-password';
import { organizationConfigs } from '@/configs/organizationConfig';

const Layout = ({ children, staticContent, session }) => {
  return (
    <>
      <Meta metaContent={staticContent.metaContent} />
      <NextAuthProvider>
        {session && <TopNavbar session={session} />}
        {session && (
          <Container className="d-flex align-items-end justify-content-between mb-3">
            <h4 className="my-0">{organizationConfigs.COMPANY_NAME}</h4>
            <div className="mx-1 my-0 text-muted smaller-label fw-bold">
              {/* <p className="my-0">Logged in user: </p> */}
              <p className="my-0">{session.user.username}</p>
            </div>
          </Container>
        )}

        <Container className="min-vh-100">{children}</Container>
        <Footer pageContent={staticContent.footerContent} />
        <GoTop scrollStepInPx="500" delayInMs="10.50" />
      </NextAuthProvider>
    </>
  );
};

export default Layout;
