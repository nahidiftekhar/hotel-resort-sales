/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

const Footer = ({ pageContent }) => {
  useEffect(() => {
    todayDate();
  }, []);

  function todayDate() {
    var d = new Date();
    var n = d.getFullYear() + '  ';
    return (document.getElementById('date').innerHTML = n);
  }

  return (
    <>
      <div className="spearator-hr mb-3 mt-5" />
      <footer className="mt-2 bg-light px-5 font-small">
        <Row className="footer-div m-0">
          <Col lg={6} className="p-0">
            Please contact{' '}
            <a className="footer-link" href="mailto: info@codemarshal.com">
              info@codemarshal.com
            </a>{' '}
            in case of you need any assistance
          </Col>
          <Col lg={6} className="p-0 copyright-section text-end">
            &copy; <em id="date"></em>CodeMarshal Systems
          </Col>
        </Row>
      </footer>
    </>
  );
};

export default Footer;
