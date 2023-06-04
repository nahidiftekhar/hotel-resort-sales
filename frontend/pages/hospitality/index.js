import ListAllVisits from '@/components/hospitality/list-all-visits';
import React from 'react';
import ReactiveButton from 'reactive-button';

function HospitalityHome() {
  return (
    <div>
      {/* <div>Button for add checkin</div>
      <div>Button for checkout</div>
      <div className="bg-light">
        table of visits
        <div>action button for add purchase record</div>
        <div>action button for add payment record</div>
        <div>action button for checkout</div>
      </div> */}
      <div className="d-flex justify-content-end my-3">
        <a href="/hospitality/add-checkin">
          <ReactiveButton
            buttonState="idle"
            idleText="Create Check-in"
            color="blue"
          />
        </a>
      </div>

      <ListAllVisits />
    </div>
  );
}

export default HospitalityHome;
