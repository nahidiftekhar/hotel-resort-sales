import React from 'react';
import Head from 'next/head';
import Meta from './Meta';
import TopNavbar from './Navbar';
import Footer from './Footer';
import GoTop from './GoTop';
import { Container } from 'react-bootstrap';
import { NextAuthProvider } from 'provider';

const Layout = ({ children, staticContent, session }) => {
  return (
    <>
      <Meta metaContent={staticContent.metaContent} />
      <NextAuthProvider>
        {session && <TopNavbar />}
        {session && (
          <Container className="d-flex align-items-center justify-content-end my-1">
            <p className="mx-1 my-0 text-muted smaller-label fw-bold">
              Logged in user: {session.user.username}
            </p>
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
