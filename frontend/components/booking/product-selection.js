import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';

import { listAllPackagesApi } from '@/api/products-api';
import { updateStateArray } from '@/components/_functions/common-functions';
import PackageSection from './package-section';
import PrixfixeSection from './prixfixe-section';
import AlacarteSection from './alacarte-section';
import RoomSection from './room-section';

function ProductSelection({ setBookingData, bookingData, daysCount }) {
  return (
    <Accordion>
      {/* Package */}
      <Accordion.Item eventKey="0" className="border-top border-5 mt-3">
        <Accordion.Header>
          <div className="d-flex justify-content-between custom-width-50">
            Package Selection
            <strong className="px-3 text-success">
              BDT {bookingData.totalPackageCost || 0}
            </strong>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <PackageSection
            setBookingData={setBookingData}
            bookingData={bookingData}
            daysCount={daysCount > 0 ? daysCount : 0}
          />
        </Accordion.Body>
      </Accordion.Item>

      {/* Prixfixe */}
      <Accordion.Item eventKey="1" className="border-top border-5 mt-3">
        <Accordion.Header>
          <div className="d-flex justify-content-between custom-width-50">
            Prixfixe Menu Selection
            <strong className="px-3 text-success">
              BDT {bookingData.totalPrixfixeCost || 0}
            </strong>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <PrixfixeSection setBookingData={setBookingData} />
        </Accordion.Body>
      </Accordion.Item>

      {/* Alacarte */}
      <Accordion.Item eventKey="2" className="border-top border-5 mt-3">
        <Accordion.Header>
          <div className="d-flex justify-content-between custom-width-50">
            Alacarte Menu Selection
            <strong className="px-3 text-success">
              BDT {bookingData.totalAlacarteCost || 0}
            </strong>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <AlacarteSection setBookingData={setBookingData} />
        </Accordion.Body>
      </Accordion.Item>

      {/* Rooms */}
      <Accordion.Item eventKey="3" className="border-top border-5 mt-3">
        <Accordion.Header>
          <div className="d-flex justify-content-between custom-width-50">
            Room Selection
            <strong className="px-3 text-success">
              BDT {bookingData.totalRoomCost || 0}
            </strong>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <RoomSection setBookingData={setBookingData} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default ProductSelection;
