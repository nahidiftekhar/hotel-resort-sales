import React, { useState } from 'react';
import ReactiveButton from 'reactive-button';
import { Accordion, Modal } from 'react-bootstrap';

import { Icon } from '@/components/_commom/Icon';
import GuestSelection from './guest-selection';
import SingleGuestInfo from '@/components/guests/single-guest-info';

function GuestSection() {
  const [showGuestSelection, setShowGuestSelection] = useState(false);
  const [checkinGuests, setCheckinGuests] = useState([]);
  return (
    <div className="my-3 p-3 border rounded-1">
      <div className="d-flex justify-content-between reactive-button-wauto mb-2">
        <h4>Guests</h4>
        <ReactiveButton
          buttonState="idle"
          rounded
          outline
          color="dark"
          idleText={<Icon nameIcon="FaUserPlus" propsIcon={{ size: 20 }} />}
          className="px-3"
          onClick={() => setShowGuestSelection(true)}
        />
      </div>

      <Accordion>
        {checkinGuests.map((guest, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{guest.name}</Accordion.Header>
            <Accordion.Body>
              <SingleGuestInfo guestData={guest} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Modal
        show={showGuestSelection}
        size="xl"
        onHide={() => setShowGuestSelection(false)}>
        <Modal.Body>
          <GuestSelection
            selectedGuests={checkinGuests}
            setSelectedGuests={setCheckinGuests}
            setShow={setShowGuestSelection}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default GuestSection;
