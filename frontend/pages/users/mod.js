import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

import { generalConfigs } from '@/configs/config';
import { writeToStorage } from '@/components/_functions/storage-variable-management';

const userId = '1';
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
    writeToStorage(userId, 'USER_KEY');
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
