import React from 'react';
import Head from 'next/head';
import Meta from './Meta';
import TopNavbar from './Navbar';
import Footer from './Footer';
import GoTop from './GoTop';
import { Container } from 'react-bootstrap';
import { NextAuthProvider } from 'pages/provider';

const Layout = ({ children, staticContent }) => {
  return (
    <>
      <Meta metaContent={staticContent.metaContent} />
      <NextAuthProvider>
        <TopNavbar />
        <Container className="min-vh-100">{children}</Container>
        <Footer pageContent={staticContent.footerContent} />
        <GoTop scrollStepInPx="500" delayInMs="10.50" />
      </NextAuthProvider>
    </>
  );
};

export default Layout;
