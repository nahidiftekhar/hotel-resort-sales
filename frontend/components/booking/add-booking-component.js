import React from 'react';
import { Modal } from 'react-bootstrap';
import EditPackage from './edit-package';
import EditPrixfixe from './edit-prixfixe';

function AddBookingComponent({
  show,
  setShow,
  componentType,
  bookingData,
  setBookingData,
  daysCount,
}) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add component</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Component Type: {componentType}
        {(() => {
          switch (componentType) {
            case 'package':
              return (
                <EditPackage
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  daysCount={daysCount}
                />
              );

            case 'prixfixe':
              return (
                <EditPrixfixe
                  setBookingData={setBookingData}
                  bookingData={bookingData}
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
