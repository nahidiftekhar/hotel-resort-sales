import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Row,
  Col,
  Accordion,
  Dropdown,
  Modal,
} from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import { fetchVisitApi } from '@/api/visit-api';
import { BDTFormat } from '@/components/_functions/number-format';
import {
  sumOfKey,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import PurchaseRecords from '@/components/hospitality/view-visit/purchase-records';
import PaymentRecord from '@/components/hospitality/view-visit/payment-record';
import ReactiveButton from 'reactive-button';
import BasicVisitData from '@/components/hospitality/view-visit/basic-visitdata';
import AddPayment from '@/components/payment/add-payment';
import AddAdjustment from '@/components/payment/add-adjustment';
import AdjustmentRecord from '@/components/hospitality/view-visit/adjustment-record';
import ConfirmCheckout from '@/components/hospitality/checkout/confirm-checkout';

function Checkout({ session }) {
  const [visitData, setVisitData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState(false);

  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const fetchVisit = async () => {
      const visitDataTemp = await fetchVisitApi(query.id);
      setVisitData(visitDataTemp || {});
      setIsLoading(false);
    };
    if (router.isReady) fetchVisit();
    setIsRefresh(false);
  }, [query, router.isReady, isRefresh]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <div className="my-4">
      <h2 className="mt-3">{visitData.visit_ref}</h2>

      {/* Basic visit data */}
      <BasicVisitData visitData={visitData} />
      <PurchaseRecords purchaseRecords={visitData.purchases} />
      <PaymentRecord visitData={visitData} />
      <AdjustmentRecord visitData={visitData} />

      {!visitData.is_settled && (
        <div className="d-flex justify-content-end my-3">
          <div className="mx-1">
            <ReactiveButton
              idleText="Add Payment"
              onClick={() => setShowPayment(true)}
            />
          </div>

          <div className="mx-1">
            <ReactiveButton
              idleText="Add Adjustment"
              onClick={() => setShowAdjustment(true)}
            />
          </div>

          <div className="mx-1">
            <ReactiveButton
              idleText="Confirm Checkout"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      )}

      <AddPayment
        show={showPayment}
        setShow={setShowPayment}
        session={session}
        visitId={visitData.id}
        setRefresh={setIsRefresh}
      />

      <AddAdjustment
        show={showAdjustment}
        setShow={setShowAdjustment}
        session={session}
        visitId={visitData.id}
        setRefresh={setIsRefresh}
      />

      <ConfirmCheckout
        show={showModal}
        setShow={setShowModal}
        visitData={visitData}
        setRefresh={setIsRefresh}
        session={session}
      />
    </div>
  );
}

export default Checkout;

{
  /* 
    keep an option to add expense
    option to add adjustment
    option to add payment amount, method, notes
    checkbox to confirm verification - room service, stay duration, key receipt
    create bill
    feedback - both side
    update room status

 */
}
