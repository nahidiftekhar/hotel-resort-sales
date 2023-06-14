import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable from 'react-data-table-component';
import { Container, Form, Modal, Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';
import {
  readFromStorage,
  writeToStorage,
} from '@/components/_functions/storage-variable-management';
import {
  approveDiscountApi,
  getMaxDiscountSlab,
  pendingApprovalRequestsApi,
} from '@/api/booking-api';
import { datetimeStringToDate } from '@/components/_functions/string-format';
import {
  BDTFormat,
  returnPercentage,
} from '@/components/_functions/number-format';
import BookingView from '../booking/booking-view';
import axios from 'axios';
import DiscountApproval from '../discounts/discount-approval';

// const userId = readFromStorage('USER_KEY');

function PendingActions({ session }) {
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [showDiscountApporoval, setShowDiscountApporoval] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(0);
  const [discountData, setDiscountData] = useState([]);

  const getPendingActionsList = async () => {
    setIsLoading(true);
    const userId = session.user.id;
    const pendingActions = await axios.get(
      `/api/dashboard/md/pending-actions-api?userId=${userId}`
    );
    setReportData(pendingActions.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getPendingActionsList();
    setRefresh(false);
  }, [refresh]);

  const headerResponsive = [
    {
      name: 'Request Date',
      selector: (row) => datetimeStringToDate(row.updatedAt),
      sortable: true,
      grow: 1,
    },
    {
      name: 'Rack Rate',
      selector: (row) => BDTFormat.format(row.rack_price),
      grow: 2,
    },
    {
      name: 'Discount',
      selector: (row) => (
        <>
          <div>{BDTFormat.format(row.total_discount)}</div>
          <div className="fw-bold text-muted">
            {returnPercentage(
              row.rack_price,
              Number(row.rack_price) - Number(row.total_discount)
            )}
          </div>
        </>
      ),
      grow: 2,
    },
    {
      name: 'Notes',
      selector: (row) => (
        <div>
          {row.discount_notes.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      ),
      wrap: true,
      grow: 3,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="my-1 d-flex">
          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 14 }} />}
              outline
              color="dark"
              className="rounded-1 py-1 px-2"
              onClick={() => {
                setCurrentBookingId(row.booking_id);
                setShowBooking(true);
              }}
            />
          </div>

          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEdit" propsIcon={{ size: 14 }} />}
              outline
              color="blue"
              className="rounded-1 py-1 px-2"
              onClick={() => {
                setDiscountData({
                  ...row,
                  amount: row.rack_price,
                  discountedAmount: row.rack_price - row.total_discount,
                });
                setShowDiscountApporoval(true);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  // const handleApproval = async (approvalStatus) => {
  //   if (!approvalStatus && !approverComment) {
  //     setErrorMessage('Please enter recommendation');
  //     return false;
  //   }
  //   if (
  //     approvalStatus &&
  //     (currentRecord.total_discount * 100) / currentRecord.rack_price >
  //       maxDiscountSlab
  //   ) {
  //     setErrorMessage('Discount cannot exceed ' + maxDiscountSlab + '%');
  //     return false;
  //   }
  //   const apiResult = await approveDiscountApi(
  //     currentRecord,
  //     approvalStatus,
  //     approverComment,
  //     userId
  //   );
  //   if (!apiResult) setErrorMessage('Something went wrong');

  //   setErrorMessage('');
  //   setShowApproval(false);
  //   setRefresh(true);
  // };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <>
      {' '}
      <DataTable
        title="Discount Requests Awaiting Approval"
        columns={headerResponsive}
        data={reportData.pendingDiscountApprovals}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />
      {/* View booking details */}
      <Modal
        show={showBooking}
        onHide={() => setShowBooking(false)}
        backdrop="static"
        keyboard={false}
        size="xl">
        <Modal.Body>
          <BookingView isNew={false} bookingId={currentBookingId} />
          <div className="center-flex">
            <ReactiveButton
              color="red"
              buttonState="idle"
              idleText="Close"
              onClick={() => setShowBooking(false)}
              className="rounded-1 bg-gradient"
            />
          </div>
        </Modal.Body>
      </Modal>
      {/* Approve discount */}
      <DiscountApproval
        show={showDiscountApporoval}
        setShow={setShowDiscountApporoval}
        discountData={discountData}
        setReferesh={setRefresh}
        session={session}
      />
    </>
  );
}

export default PendingActions;
