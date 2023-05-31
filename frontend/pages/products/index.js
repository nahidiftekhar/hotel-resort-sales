import Link from 'next/link';
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

function AddNewPackage() {
  return (
    <div className="d-flex justify-content-between align-items-center my-5">
      <Link href="/products/list?type=package">
        <ReactiveButton buttonState="idle" idleText="Packages" size="large" />
      </Link>

      <Link href="/products/list?type=room">
        <ReactiveButton buttonState="idle" idleText="Rooms" size="large" />
      </Link>

      <Link href="/products/list?type=prixfixe">
        <ReactiveButton
          buttonState="idle"
          idleText="Prixfixe Items"
          size="large"
        />
      </Link>

      <Link href="/products/list?type=alacarte">
        <ReactiveButton
          buttonState="idle"
          idleText="A La Carte Items"
          size="large"
        />
      </Link>

      <Link href="/products/list?type=service">
        <ReactiveButton buttonState="idle" idleText="Services" size="large" />
      </Link>
    </div>
  );
}

export default AddNewPackage;
