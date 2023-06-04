import { signIn, signOut } from 'next-auth/react';

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
  return (
    <button
      className="text-white font-bold py-0 px-3 ms-5 bg-secondary bg-gradient rounded-1"
      onClick={() => signOut()}>
      <span className="fs-6">Sign out</span>
    </button>
  );
};
