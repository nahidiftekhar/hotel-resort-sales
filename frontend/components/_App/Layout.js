import React from 'react';
import Head from 'next/head';
import Meta from './Meta';
import TopNavbar from './Navbar';
import Footer from './Footer';
import GoTop from './GoTop';
import { Container } from 'react-bootstrap';

const Layout = ({ children, staticContent }) => {
  return (
    <>
      <Meta metaContent={staticContent.metaContent} />
      <TopNavbar />
      <Container className="min-vh-100">{children}</Container>
      <Footer pageContent={staticContent.footerContent} />
      <GoTop scrollStepInPx="500" delayInMs="10.50" />
    </>
  );
};

export default Layout;
