import React, { useState } from 'react';
import ReactiveButton from 'reactive-button';
import Router from 'next/router';

import GuestSection from '@/components/hospitality/add-checkin/guests-section';
import CheckinForm from '@/components/hospitality/add-checkin/checkin-form';
import { createCheckinApi } from '@/api/visit-api';

function AddCheckin({ session }) {
  const [checkinGuests, setCheckinGuests] = useState([]);
  const [checkInData, setCheckinData] = useState({});

  const handleCreateCheckin = async () => {
    const guestIdArray = checkinGuests.map((obj) => obj.id);
    const submissionData = {
      checkinDate: checkInData.checkinDate,
      checkoutDate: checkInData.checkoutDate,
      roomId: checkInData.roomId,
      bookigId: checkInData.booking.id,
      advancedAmount: checkInData.booking.advanced_amount,
      amount: checkInData.booking.amount,
      guestIdArray: guestIdArray,
      guestId: guestIdArray[0],
      notes: checkInData.notes,
      userId: session.user.id,
    };
    const res = await createCheckinApi(submissionData);
    if (res.success) {
      alert('Checkin successful');
      setTimeout(() => {
        Router.push('/hospitality');
      }, 100);
    }
  };

  return (
    <>
      <GuestSection
        checkinGuests={checkinGuests}
        setCheckinGuests={setCheckinGuests}
      />
      <CheckinForm checkInData={checkInData} setCheckinData={setCheckinData} />

      <div className="center-flex my-5">
        <ReactiveButton
          buttonState="idle"
          idleText="Create Check-in"
          color="teal"
          size="large"
          rounded
          shadow
          onClick={() => handleCreateCheckin()}
        />
      </div>
    </>
  );
}

export default AddCheckin;
