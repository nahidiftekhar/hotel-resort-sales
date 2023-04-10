/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";

const Footer = ({ pageContent }) => {
  useEffect(() => {
    todayDate();
  }, []);

  function todayDate() {
    var d = new Date();
    var n = d.getFullYear() + "  ";
    return (document.getElementById("date").innerHTML = n);
  }

  return (
    <>
      <div className="spearator-hr mb-3 mt-5" />
      <footer className="container mt-2">
        <Row className="footer-div m-0">
          <Col lg={6} className="p-0">
            Please contact{" "}
            <a className="footer-link" href="mailto: support@smarttaps.com">
              support@smarttaps.com
            </a>{" "}
            in case of you need any assistance
          </Col>
          <Col lg={6} className="p-0 copyright-section">
            &copy; <em id="date"></em>Smart Taps
          </Col>
        </Row>
      </footer>
    </>
  );
};

export default Footer;
