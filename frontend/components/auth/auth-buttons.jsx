import { signIn, signOut } from 'next-auth/react';
import ReactiveButton from 'reactive-button';
import { Icon } from '../_commom/Icon';
import { ClipLoader } from 'react-spinners';
import React, { useState } from 'react';

export const LogInButton = () => {
  return (
    <button
      className="bg-blue-600 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full"
      onClick={() => signIn()}>
      Sign in
    </button>
  );
};

export const LogOutButton = () => {
  const [buttonState, setButtonState] = useState('idle');
  return (
    <div className="reactive-button-wauto">
      <ReactiveButton
        buttonState={buttonState}
        idleText={<Icon nameIcon="FaPowerOff" propsIcon={{ size: 12 }} />}
        loadingText={
          <ClipLoader
            color="#ffffff"
            size={12}
            speedMultiplier={1}
            className="p-1 py-0"
          />
        }
        messageDuration={2000}
        animation={true}
        rounded
        color="red"
        className="p-2 bg-gradient"
        onClick={() => {
          setButtonState('loading');
          signOut();
        }}
      />
    </div>
  );
};
