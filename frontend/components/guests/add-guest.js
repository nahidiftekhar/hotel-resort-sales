import React, { useState, useEffect } from 'react';
import { Modal, Alert, Row, Col, Form, Button } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';
import ImageUpload from '@/components/_commom/image-upload';
import { generateRandomString } from '@/components/_functions/common-functions';
import { addSingleGuestApi } from '@/api/guest-api';
import { RiseLoader } from 'react-spinners';

function AddGuest({ show, setShow, setRefresh, setNewGuest }) {
  const [newGuestData, setNewGuestData] = useState({});
  const [profileImage, setProfileImage] = useState();
  const [idFront, setIdFront] = useState();
  const [idBack, setIdBack] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonState, setButtonState] = useState('idle');

  useEffect(() => {
    setNewGuestData({});
  }, [show]);

  const handleClose = () => {
    setShow(false);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    setButtonState('loading');
    const result = await addSingleGuestApi(
      newGuestData,
      profileImage,
      idFront,
      idBack
    );
    if (result.success) {
      setButtonState('success');
      setRefresh(true);
      setShow(false);
      if (setNewGuest) setNewGuest(result.dbResult);
      setShowAlert(true);
      setErrorMessage('');
      setButtonState('idle');
    } else setErrorMessage('Something went wrong. Adding guest failed');
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl">
        <Modal.Header className="justify-content-center">
          <Modal.Title>
            <h3 className="fw-bold text-center">ADD GUEST</h3>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddGuest}>
          <Modal.Body>
            <h4>Please provide necessary information.</h4>
            <Row className="m-0 p-0">
              <Col md={8}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Name of Guest</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    required
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
                    required
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
                    // required //Kept optional.
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
                <ImageUpload
                  setImage={setProfileImage}
                  saveLocation={'profiles'}
                />
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
                    // required
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
                    required
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
                    // required
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
                    // required
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
                    // required
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
                <ImageUpload setImage={setIdFront} saveLocation={'id-front'} />
              </Col>

              <Col md={6}>
                <h5 className="text-center m-0">ID Card Back</h5>
                <ImageUpload setImage={setIdBack} saveLocation={'id-back'} />
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
                    // required
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
            <div className="error-message text-center">
              {errorMessage || ''}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <ReactiveButton
              buttonState="idle"
              idleText={<span className="">Cancel</span>}
              onClick={handleClose}
              color="red"
            />

            <ReactiveButton
              buttonState={buttonState}
              idleText={<span className="">Add Guest</span>}
              type={'submit'}
              color="blue"
              loadingText={
                <RiseLoader color="#ffffff" size={5} speedMultiplier={2} />
              }
              successText={
                <span className="d-flex justify-content-center">
                  <Icon nameIcon="FaRegThumbsUp" />
                </span>
              }
              messageDuration={2000}
              animation={true}
            />
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showAlert}
        backdrop="static"
        keyboard={false}
        size="sm"
        centered>
        <Modal.Body>
          <h5 className="text-success">New Guest Added</h5>
          <p>New guest added to system with your provided inputs</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button
              onClick={() => setShowAlert(false)}
              variant="outline-success">
              Proceed
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddGuest;
