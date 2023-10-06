import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Accordion, Dropdown } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';

import { Icon } from '@/components/_commom/Icon';
import SingleGuestInfo from '@/components/guests/single-guest-info';
import AddPurchase from '@/components/hospitality/purchase/add-purchase';
import { fetchVisitApi, fetchVisitPurchasesApi } from '@/api/visit-api.js';
import PurchaseRecords from '@/components/hospitality/view-visit/purchase-records';
import ExpenseRecord from '@/components/hospitality/view-visit/expense-record';
import PaymentRecord from '@/components/hospitality/view-visit/payment-record';
import { BDTFormat } from '@/components/_functions/number-format';
import {
  sumOfKey,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import ReactiveButton from 'reactive-button';
import AddPayment from '@/components/payment/add-payment';
import AddAdjustment from '@/components/payment/add-adjustment';
import AdjustmentRecord from '@/components/hospitality/view-visit/adjustment-record';

const componentList = [
  { id: 1, name: 'Package', icon: 'FaBoxes', type: 'package' },
  { id: 2, name: 'Prixfixe', icon: 'FaUtensils', type: 'prixfixe' },
  { id: 3, name: 'À la carte', icon: 'FaUtensilSpoon', type: 'alacarte' },
  { id: 4, name: 'Room', icon: 'MdLocalHotel', type: 'room' },
  { id: 5, name: 'Services', icon: 'FaTableTennis', type: 'service' },
  { id: 6, name: 'Venue', icon: 'MdMeetingRoom', type: 'venue' },
  { id: 7, name: 'Lump Sum', icon: 'MdFoodBank', type: 'custom' },
];

function ViewVisit({ session }) {
  const [visitData, setVisitData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);
  const [componentType, setComponentType] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState(false);

  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const fetchVisit = async () => {
      const visitDataTemp = await fetchVisitApi(query.id);
      setVisitData(visitDataTemp || {});
      setIsLoading(false);
      setRefresh(false);
    };
    if (router.isReady) fetchVisit();
  }, [query, router.isReady, refresh]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mt-3">{visitData.visit_ref}</h2>

        <div className="d-flex">
          <div className="edit-component mx-1">
            <Dropdown>
              <Dropdown.Toggle
                id="add-action"
                variant="dark"
                className="btn btn-one my-0 py-1 px-2 rounded-1 bg-gradient">
                <span className="mx-2">Add Purchase</span>{' '}
                <Icon nameIcon="FaCaretDown" propsIcon={{ size: 12 }} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-custom" variant="dark">
                {componentList.map(({ id, name, icon, type }) => (
                  <Dropdown.Item
                    key={id}
                    href="#"
                    className="btn btn-three d-flex justify-content-between px-3"
                    onClick={() => {
                      setComponentType(type);
                      setShowPurchase(true);
                    }}>
                    {name}
                    <Icon nameIcon={icon} propsIcon={{ size: 20 }} />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mx-1">
            <ReactiveButton
              idleText="Add Adjustment"
              color="indigo"
              className="bg-gradient rounded-1"
              onClick={() => setShowAdjustment(true)}
            />
          </div>

          <div className="mx-1">
            <ReactiveButton
              idleText="Add Payment"
              color="teal"
              className="bg-gradient rounded-1"
              onClick={() => setShowPayment(true)}
            />
          </div>

          <a href={`/hospitality/checkout?id=${visitData.id}`}>
            <ReactiveButton
              buttonState="idle"
              className="rounded-1 bg-gradient"
              idleText="Check-out"
              color="green"
            />
          </a>
        </div>
      </div>
      {/* Basic visit data */}
      <Row className="mt-3 mb-2 mx-0 border border-dark border-opacity-75">
        <Col md={6} className="p-0">
          <div className="p-2 border ">
            <span className="text-muted fw-bold">Guest: </span>
            <span className="fw-bold">{visitData.guest?.name}</span>
          </div>
        </Col>
        <Col md={6} className="p-0">
          <div className="p-2 border ">
            <span className="text-muted fw-bold">Room no: </span>
            <span className="fw-bold">{visitData.room_number}</span>
          </div>
        </Col>
        <Col md={6} className="p-0">
          <div className="p-2 border ">
            <span className="text-muted fw-bold">Check-in Date: </span>
            <span className="fw-bold">{visitData.checkin_date}</span>
          </div>
        </Col>
        <Col md={6} className="p-0">
          <div className="p-2 border ">
            <span className="text-muted fw-bold">Check-out Date: </span>
            <span className="fw-bold">{visitData.checkout_date}</span>
          </div>
        </Col>

        <Col md={4} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Total Expense: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                sumOfKeyMultiply(
                  visitData.purchases,
                  'unit_price',
                  'item_count'
                ) || 0
              )}
            </span>
          </div>
        </Col>

        <Col md={4} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Total Payment: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                sumOfKey(visitData.paymentRecords, 'amount') || 0
              )}
            </span>
          </div>
        </Col>

        <Col md={4} className="p-0">
          <div className="p-2 border d-flex justify-content-between">
            <span className="text-muted fw-bold">Receivable: </span>
            <span className="fw-bold">
              {BDTFormat.format(
                (sumOfKeyMultiply(
                  visitData.purchases,
                  'unit_price',
                  'item_count'
                ) || 0) - (sumOfKey(visitData.paymentRecords, 'amount') || 0)
              )}
            </span>
          </div>
        </Col>
      </Row>

      <ExpenseRecord visitData={visitData} />
      <PaymentRecord visitData={visitData} />
      <AdjustmentRecord visitData={visitData} />

      {/* Guests */}
      <h5 className="mt-4 mb-1">Guests</h5>
      <div className="guest-section">
        <Accordion>
          {visitData.otherGuests?.map((guest, index) => (
            <Accordion.Item eventKey={index} key={index}>
              <Accordion.Header>{guest.name}</Accordion.Header>
              <Accordion.Body>
                <SingleGuestInfo guestData={guest} />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Booking */}
      <h5 className="mt-4 mb-1">Booking Details</h5>
      {visitData.booking && (
        <div className="border rounded-1 p-3 pb-0 visit-booking font-small">
          <Row className="h-100">
            <Col xs={9} className="">
              <Row className="border-bottom">
                <Col xs={6}>Item Name</Col>
                <Col xs={3}>Type</Col>
                <Col xs={3} className="text-end">
                  Count
                </Col>
              </Row>

              {/* Package booking */}
              {visitData.booking.components.packageDetails?.length &&
                visitData.booking.components.packageDetails.map(
                  (item, index) => (
                    <Row key={index} className="border-bottom">
                      <Col xs={6}>{item.name}</Col>
                      <Col xs={3}>Package</Col>
                      <Col xs={3} className="text-end">
                        <p className="my-0 font-small">
                          Adult: {item.adult_count}
                        </p>
                        {Number(item.kids_count) > 0 && (
                          <p className="my-0 font-small">
                            Kids: {item.kids_count}
                          </p>
                        )}
                      </Col>
                    </Row>
                  )
                )}

              {/* Prixfixe booking */}
              {visitData.booking.components.prixfixeDetails?.length &&
                visitData.booking.components.prixfixeDetails.map(
                  (item, index) => (
                    <Row key={index} className="border-bottom">
                      <Col xs={6}>{item.name}</Col>
                      <Col xs={3}>Prixfixe</Col>
                      <Col xs={3} className="text-end">
                        {item.prixfixe_count}
                      </Col>
                    </Row>
                  )
                )}

              {/* Alacarte booking */}
              {visitData.booking.components.alacarteDetails?.length &&
                visitData.booking.components.alacarteDetails.map(
                  (item, index) => (
                    <Row key={index} className="border-bottom">
                      <Col xs={6}>{item.name}</Col>
                      <Col xs={3}>A la carte</Col>
                      <Col xs={3} className="text-end">
                        {item.alacarte_count}
                      </Col>
                    </Row>
                  )
                )}

              {/* Room booking */}
              {visitData.booking.components.roomDetails?.length &&
                visitData.booking.components.roomDetails.map((item, index) => (
                  <Row key={index} className="border-bottom">
                    <Col xs={6}>{item.roomtype?.room_type_name}</Col>
                    <Col xs={3}>Room</Col>
                    <Col xs={3} className="text-end">
                      {item.room_count}
                    </Col>
                  </Row>
                ))}

              {/* Service booking */}
              {visitData.booking.components.serviceDetails?.length &&
                visitData.booking.components.serviceDetails.map(
                  (item, index) => (
                    <Row key={index} className="border-bottom">
                      <Col xs={6}>{item.name}</Col>
                      <Col xs={3}>Service</Col>
                      <Col xs={3} className="text-end">
                        {item.service_count}
                      </Col>
                    </Row>
                  )
                )}
            </Col>

            {/* Price */}
            <Col xs={3} className="d-flex flex-column">
              <div className="border-bottom text-end">
                <span className="d-sm-none">Price</span>
                <span className="d-none d-sm-block">
                  Discounted Price (BDT)
                </span>
              </div>
              <div className="border-bottom text-end d-flex align-items-center   justify-content-end h-100">
                {visitData.booking.discounted_amount}
              </div>
            </Col>
          </Row>
        </div>
      )}

      <PurchaseRecords purchaseRecords={visitData.purchases} />
      <AddPurchase
        show={showPurchase}
        setShow={setShowPurchase}
        componentType={componentType}
        visitId={visitData.id}
        setRefresh={setRefresh}
        session={session}
      />

      <AddPayment
        show={showPayment}
        setShow={setShowPayment}
        session={session}
        visitId={visitData.id}
        setRefresh={setRefresh}
      />

      <AddAdjustment
        show={showAdjustment}
        setShow={setShowAdjustment}
        session={session}
        visitId={visitData.id}
        setRefresh={setRefresh}
      />
    </>
  );
}

export default ViewVisit;
