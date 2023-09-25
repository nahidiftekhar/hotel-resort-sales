import Link from 'next/link';
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

function AddNewPackage() {
  return (
    <div className="d-flex flex-column justify-content-between align-items-center my-5">
      <Link className="my-2" href="/products/list?type=roomtypes">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="Room Categories"
          size="large"
          color="blue"
          rounded
        />
      </Link>

      <Link className="my-2" href="/products/list?type=room">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="Rooms"
          size="large"
          color="blue"
          rounded
        />
      </Link>

      <Link className="my-2" href="/products/list?type=package">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="Packages"
          size="large"
          rounded
          color="blue"
        />
      </Link>

      <Link className="my-2" href="/products/list?type=prixfixe">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="Prixfixe Items"
          size="large"
          color="blue"
          rounded
        />
      </Link>

      <Link className="my-2" href="/products/list?type=alacarte">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="A La Carte Items"
          size="large"
          color="blue"
          rounded
        />
      </Link>

      <Link className="my-2" href="/products/list?type=service">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="Services"
          size="large"
          color="blue"
          rounded
        />
      </Link>

      <Link className="my-2" href="/products/list?type=venues">
        <ReactiveButton
          className="w-300px"
          buttonState="idle"
          idleText="Venues"
          size="large"
          color="blue"
          rounded
        />
      </Link>
    </div>
  );
}

export default AddNewPackage;
