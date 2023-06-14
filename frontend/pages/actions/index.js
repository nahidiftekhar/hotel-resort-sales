import React from 'react';
import PendingActions from '@/components/actions/pending-actions';

function ActionsHome({ session }) {
  return (
    <>
      <PendingActions session={session} />
    </>
  );
}

export default ActionsHome;
