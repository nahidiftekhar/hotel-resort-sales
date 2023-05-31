import React, { useState, useEffect } from 'react';
import { Modal, Alert, Row, Col, Form, Button } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { beConfig } from '@/configs/backend';
import Image from 'next/image';

function ViewGuest({ show, setShow, modGuestData }) {
  const [newGuestData, setNewGuestData] = useState({});

  useEffect(() => {
    setNewGuestData(modGuestData);
    setNewGuestData((currentData) => ({
      ...currentData,
      idNumber: modGuestData.id_number,
      idType: modGuestData.id_type,
      dob: modGuestData.date_of_birth,
    }));
  }, [modGuestData]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header className="justify-content-center">
          <Modal.Title>
            <h3 className="fw-bold text-center">VIEW GUEST DATA</h3>
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            {/* <h4>Please modify necessary information.</h4> */}
            <Row className="m-0 p-0">
              <Col md={8}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Name of Guest</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    size="sm"
                    placeholder="Full Name"
                    value={newGuestData.name || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        name: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    disabled
                    placeholder="+8801_________"
                    value={newGuestData.phone || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        phone: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    disabled
                    placeholder="valid email id"
                    value={newGuestData.email || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        email: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <h5 className="text-center m-0">Visitor&apos;s Image</h5>
                <div className="image-preview smaller-label text-center text-muted">
                  <Image
                    src={`${beConfig.host}/static/images/profiles/${modGuestData.photo_image_url}`}
                    width={200}
                    height={200}
                    alt="current image"
                  />
                </div>
              </Col>

              <Col md={12} className="">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Full Address</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows={2}
                    size="sm"
                    disabled
                    placeholder="Full address of the guest"
                    value={newGuestData.address || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        address: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    disabled
                    placeholder="Nationality"
                    value={
                      newGuestData.nationality === null ||
                      newGuestData.nationality === undefined
                        ? 'Bangladeshi'
                        : newGuestData.nationality
                    }
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        nationality: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    disabled
                    placeholder="YYYY/MM/DD"
                    value={newGuestData.dob || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        dob: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Identity Card Type</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    disabled
                    placeholder="NID/Passport/Driving License/etc."
                    value={newGuestData.idType || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        idType: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    disabled
                    placeholder="NID/Passport/Driving License/etc. number"
                    value={newGuestData.idNumber || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        idNumber: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h5 className="text-center m-0">ID Card Front</h5>
                <div className="image-preview smaller-label text-center text-muted">
                  <Image
                    src={`${beConfig.host}/static/images/id-front/${modGuestData.id_image_front}`}
                    width={400}
                    height={300}
                    alt="current image"
                  />
                </div>
              </Col>

              <Col md={6}>
                <h5 className="text-center m-0">ID Card Back</h5>
                <div className="image-preview smaller-label text-center text-muted">
                  <Image
                    src={`${beConfig.host}/static/images/id-back/${modGuestData.id_image_back}`}
                    width={400}
                    height={300}
                    alt="current image"
                  />
                </div>
              </Col>

              <Col md={12} className="">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows={2}
                    size="sm"
                    disabled
                    placeholder="Any other notes"
                    value={newGuestData.notes || ''}
                    onChange={(e) =>
                      setNewGuestData((currentData) => ({
                        ...currentData,
                        notes: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <ReactiveButton
              buttonState="idle"
              idleText={<span className="">Close</span>}
              onClick={handleClose}
              color="red"
            />
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ViewGuest;
