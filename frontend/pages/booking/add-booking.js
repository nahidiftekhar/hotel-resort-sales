import React from 'react';

import BookingManagement from '@/components/booking/booking-management';

function AddBooking({ session }) {
  return (
    <div className="d-flex justify-content-center">
      <BookingManagement bookingId={0} isNew={true} session={session} />
    </div>
  );
}

export default AddBooking;
