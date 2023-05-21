import React from 'react';
import { useSearchParams } from 'next/navigation';
import BookingManagement from '@/components/booking/booking-management';

function ShowBooking() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  return (
    <div>
      <BookingManagement bookingId={bookingId} isNew={false} />
    </div>
  );
}

export default ShowBooking;
