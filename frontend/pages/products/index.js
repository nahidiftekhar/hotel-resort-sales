import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import QuillComponent from '@/components/products/quill-component';
import { sendMail } from '@/api/communication-api';

function AddNewPackage() {
  const [value, setValue] = useState('');
  const [deltaValue, setDeltaValue] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [mailSubject, setMailSubject] = useState('');

  const handleSendMail = async () => {
    const mailData = {
      toEmail,
      mailSubject,
      mailBody: value,
    };
    const apiResult = await sendMail(mailData);
    console.log('apiResult: ' + JSON.stringify(apiResult));
  };

  return (
    <>
      <Row>
        <Col md={6} className="my-3">
          <QuillComponent
            value={value}
            setValue={setValue}
            deltaValue={deltaValue}
            setDeltaValue={setDeltaValue}
          />
        </Col>
        <Col md={6}>
          <div className="custom-form d-flex flex-column justify-content-between">
            <div className="my-3">
              <label>Email Address</label>
              <input
                type="email"
                name="toEmail"
                onChange={(e) => setToEmail(e.target.value)}
              />
            </div>
            <div className="my-3">
              <label>Mail Subject</label>
              <input
                type="text"
                name="mailSubject"
                onChange={(e) => setMailSubject(e.target.value)}
              />
            </div>
            <ReactiveButton
              buttonState="idle"
              idleText="Send Mail"
              onClick={handleSendMail}
              className="my-3"
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default AddNewPackage;
