import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  readFromStorage,
  writeToStorage,
} from '@/components/_functions/storage-variable-management';

function Home() {
  const [userData, setUserData] = useState('');
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    writeToStorage(userId?.toString(), 'USER_KEY');
    setUserData(readFromStorage('USER_KEY'));
  }, [session, userId]);

  return (
    <div>
      <div>session: {JSON.stringify(session?.user)}</div>
      <div>userId: {userData}</div>
    </div>
  );
}

export default Home;
