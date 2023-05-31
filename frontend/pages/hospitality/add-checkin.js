import React from 'react';
import CheckinForm from '@/components/hospitality/add-checkin/checkin-form';
import ReactiveButton from 'reactive-button';
import { Icon } from '@/components/_commom/Icon';
import GuestSection from '@/components/hospitality/add-checkin/guests-section';

function AddCheckin() {
  return (
    <>
      <GuestSection />
      <CheckinForm />
    </>
  );
}

export default AddCheckin;
