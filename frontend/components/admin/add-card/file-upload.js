/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";

import { generateRandomString } from "@/components/functions/helpers";
import { beConfig } from "@/configs/backend";

function FileUpload({ cardData, setCardData, setImage, imageFile }) {
  const [qrImage, setQrImage] = useState(
    imageFile
      ? `${beConfig.host}static/images/qr/${imageFile}`
      : `${beConfig.host}static/images/qr/_default.png`
  );
  const [errorMessage, setErroMessage] = useState('');

  const uploadFile = async (e) => {
    const fileExtension =
      e.target.files[0].name.split(".")[
        e.target.files[0].name.split(".").length - 1
      ];
    if (e.target.files[0].size/1024 > 5120 || ['jpg', 'jpeg', 'png'].indexOf(fileExtension)===-1) {
      setErroMessage('Please upload image (jpg/png) below 5MB');
      setQrImage(`${beConfig.host}static/images/qr/_default.png`)
      return false
    }
    const fileName = `${cardData.cardLink}-${await generateRandomString(
      6
    )}.${fileExtension}`;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(
        `${beConfig.host}uploadqr`,
        formData
      );
      setQrImage(
        `${beConfig.host}static/images/qr/${fileName}?${await generateRandomString(3)}`
      );
      setErroMessage('')
      setImage(fileName);
      setCardData((cardData) => ({
        ...cardData,
        qrCode: fileName,
      }));
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <Row>
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className=" mb-3">
            <img
              src={qrImage}
              style={{ height: "150px", maxWidth: "100%" }}
            />
          </div>
        </Col>
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <input
            type="file"
            name="file"
            id="file"
            accept="image/*"
            onChange={uploadFile}
            className="inputfile"
          />
          <label for="file">Upload QR Code Image</label>
        </Col>
        <Col sm={12} className="text-center error-message">{errorMessage}</Col>
      </Row>
    </div>
  );
}

export default FileUpload;
