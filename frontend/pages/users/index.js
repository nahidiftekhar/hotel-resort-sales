import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CryptoJS from 'crypto-js';

import { generalConfigs } from '@/configs/config';
import { writeToStorage } from '@/components/_functions/storage-variable-management';

const defaultUserId = '1';
const guestId = '14';

function UsersHome() {
  const [currentUserId, setcurrentUserId] = useState(defaultUserId);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const userId = query.userId || defaultUserId;
    setcurrentUserId(userId);
    writeToStorage(guestId, 'GUEST_KEY');
    writeToStorage(userId, 'USER_KEY');
  }, [query.userId]);

  return <div>query.userId: {currentUserId}</div>;
}

export default UsersHome;
