import Link from 'next/link';
import React from 'react';

function SettingsHome({ session }) {
  return (
    <div className="center-flex flex-column min-vh-70">
      <Link
        href="/auth/change-password"
        className="placeholder-glow important-div my-2">
        <div
          className={`min-vw-30 rounded-1 text-center bg-gradient px-3 py-1 ${
            session.user.passChangePending
              ? 'bg-warning placeholder text-dark'
              : 'bg-secondary text-white'
          }`}>
          Change Password
        </div>
      </Link>

      {session.user.usertype === 2 && (
        <Link href="/users/create-user" className="my-2">
          <div className="min-vw-30 rounded-1 bg-gradient bg-secondary text-white text-center px-3 py-1">
            Add User
          </div>
        </Link>
      )}
    </div>
  );
}

export default SettingsHome;
