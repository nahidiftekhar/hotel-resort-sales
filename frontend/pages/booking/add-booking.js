import React from 'react';

import BookingFrom from '@/components/booking/booking-form';
import BookingManagement from '@/components/booking/booking-management';

function AddBooking() {
  return (
    <div className="d-flex justify-content-center">
      {/* <BookingFrom /> */}
      <BookingManagement bookingId={0} isNew={true} />
    </div>
  );
}

export default AddBooking;
