import React from 'react';
import PendingActions from '@/components/actions/pending-actions';
import MyBookings from '@/components/actions/my-bookings';
import MyItems from '@/components/actions/my-items';
import MyPurchases from '@/components/actions/my-purchases';

function ActionsHome({ session }) {
  return (
    <>
      {/* <PendingActions session={session} /> */}
      <MyItems session={session} />
      <MyPurchases session={session} />
      <MyBookings session={session} />
    </>
  );
}

export default ActionsHome;
