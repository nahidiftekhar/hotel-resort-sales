import React from 'react';
import { Modal } from 'react-bootstrap';
import EditPackage from './edit-package';
import EditPrixfixe from './edit-prixfixe';
import { camelCaseToCapitalizedString } from '../_functions/string-format';
import EditAlacarte from './edit-alacarte';
import EditRoom from './edit-room';
import EditService from './edit-service';
import EditVenue from './edit-venue';

function AddBookingComponent({
  show,
  setShow,
  componentType,
  bookingData,
  setBookingData,
  daysCount,
  session,
}) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Add {camelCaseToCapitalizedString(componentType)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(() => {
          switch (componentType) {
            case 'package':
              return (
                <EditPackage
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  setShow={setShow}
                />
              );

            case 'prixfixe':
              return (
                <EditPrixfixe
                  setBookingData={setBookingData}
                  bookingData={bookingData}
                  setShow={setShow}
                />
              );

            case 'alacarte':
              return (
                <EditAlacarte
                  setBookingData={setBookingData}
                  bookingData={bookingData}
                  setShow={setShow}
                />
              );

            case 'room':
              return (
                <EditRoom
                  setBookingData={setBookingData}
                  bookingData={bookingData}
                  setShow={setShow}
                  daysCount={daysCount}
                  session={session}
                />
              );

              case 'venue':
                return (
                  <EditVenue
                    setBookingData={setBookingData}
                    bookingData={bookingData}
                    setShow={setShow}
                  />
                );
  
            case 'service':
              return (
                <EditService
                  setBookingData={setBookingData}
                  bookingData={bookingData}
                  setShow={setShow}
                />
              );

            default:
              return <div className="error-message">Something went wrong</div>;
          }
        })()}
      </Modal.Body>
    </Modal>
  );
}

export default AddBookingComponent;
