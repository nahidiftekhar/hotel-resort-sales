import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

import { generalConfigs } from '@/configs/config';

const userId = '2';
const guestId = '14';

const encodedGuestId = CryptoJS.AES.encrypt(
  guestId,
  generalConfigs.ENCRYPTION_SECRET
).toString();

const encodedUserId = CryptoJS.AES.encrypt(
  userId,
  generalConfigs.ENCRYPTION_SECRET
).toString();

// const decodedGuestId = CryptoJS.AES.decrypt(
//   encodedGuestId,
//   generalConfigs.ENCRYPTION_SECRET
// ).toString(CryptoJS.enc.Utf8);

function UsersHome() {
  useEffect(() => {
    localStorage.setItem('userDetail', encodedUserId);
    localStorage.setItem('guestDetail', encodedGuestId);
  }, []);

  return (
    <div>
      userID:{' '}
      {/* {localStorage.getItem('userDetail') &&
        CryptoJS.AES.decrypt(
          localStorage.getItem('userDetail'),
          generalConfigs.ENCRYPTION_SECRET
        )} */}
      {/* guestID:{' '}
      {CryptoJS.AES.decrypt(
        localStorage.getItem('guestDetail'),
        generalConfigs.ENCRYPTION_SECRET
      )} */}
    </div>
  );
}

export default UsersHome;
