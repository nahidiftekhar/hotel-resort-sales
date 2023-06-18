import React from 'react';

import HomeManager from '@/components/home/home-manager';
import RoomWiseView from '@/components/rooms/room-wise-view';

function Home({ session }) {
  return (
    <div className="my-3">
      {(() => {
        switch (session.user?.usertype) {
          case 2:
            return <HomeManager session={session} />;
          case 1:
            return <HomeManager session={session} />;
          default:
            return <RoomWiseView session={session} />;
          // return <div className="error-message">Other roles</div>;
        }
      })()}
    </div>
  );
}

export default Home;
