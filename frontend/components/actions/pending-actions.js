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

// const userId = readFromStorage('USER_KEY');

function PendingActions() {
  const [refresh, setRefresh] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(0);
  const [approverComment, setApproverComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [maxDiscountSlab, setMaxDiscountSlab] = useState(50);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const getListOfPendingDiscount = async () => {
      setIsLoading(true);
      const userId = readFromStorage('USER_KEY');
      const pendingApprovalRequests = await pendingApprovalRequestsApi(userId);
      setFilterData((current) => [...pendingApprovalRequests]);
      const maxSlab = await getMaxDiscountSlab();
      setMaxDiscountSlab(maxSlab);
      setIsLoading(false);
    };
    getListOfPendingDiscount();
    setUserId(readFromStorage('USER_KEY'));
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
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 20 }} />}
              outline
              color="dark"
              className="rounded-1 py-1 px-3"
              onClick={() => {
                setCurrentBookingId(row.booking_id);
                setShowBooking(true);
              }}
            />
          </div>

          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEdit" propsIcon={{ size: 20 }} />}
              outline
              color="green"
              className="rounded-1 py-1 px-3"
              onClick={() => {
                setApproverComment('');
                setCurrentRecord(row);
                setShowApproval(true);
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

  const handleApproval = async (approvalStatus) => {
    if (!approvalStatus && !approverComment) {
      setErrorMessage('Please enter recommendation');
      return false;
    }
    if (
      approvalStatus &&
      (currentRecord.total_discount * 100) / currentRecord.rack_price >
        maxDiscountSlab
    ) {
      setErrorMessage('Discount cannot exceed ' + maxDiscountSlab + '%');
      return false;
    }
    const apiResult = await approveDiscountApi(
      currentRecord,
      approvalStatus,
      approverComment,
      userId
    );
    if (!apiResult) setErrorMessage('Something went wrong');

    setErrorMessage('');
    setShowApproval(false);
    setRefresh(true);
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <>
      <DataTable
        title="Discount Requests Awaiting Approval"
        columns={headerResponsive}
        data={filterData}
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
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <BookingView isNew={false} bookingId={currentBookingId} />
        </Modal.Body>
      </Modal>

      {/* Approve/reject discount request */}
      <Modal
        show={showApproval}
        onHide={() => setShowApproval(false)}
        backdrop="static"
        keyboard={false}>
        <Modal.Body>
          <Row className="custom-form arrow-hidden mt-1 mb-4">
            <Col md={6}>
              <label>Rack Rate</label>
              <input
                disabled
                type="text"
                value={Number(currentRecord?.rack_price).toFixed(2)}
              />
            </Col>

            <Col md={6}>
              <label>Requested Discount</label>
              <input
                disabled
                type="text"
                value={(
                  Number(currentRecord?.rack_price) -
                  Number(currentRecord?.booking?.discounted_amount)
                ).toFixed(2)}
              />
            </Col>

            {/* <Col md={6} xs={9} className="my-2">
              <label>Approve Discount</label>
              <input
                type="number"
                min={0}
                max={currentRecord?.rack_price * (1 - maxDiscountSlab / 100)}
                value={Number(currentRecord?.total_discount).toFixed(2)}
                onChange={(e) => {
                  setCurrentRecord({
                    ...currentRecord,
                    total_discount: e.target.value,
                  });
                }}
              />
            </Col>

            <Col md={6} xs={3} className="my-2 d-flex align-items-end">
              <span
                className={
                  (currentRecord?.total_discount * 100) /
                    currentRecord?.rack_price >
                  maxDiscountSlab
                    ? 'error-message'
                    : 'font-small text-muted fw-bold'
                }>
                {(
                  (currentRecord?.total_discount * 100) /
                  currentRecord?.rack_price
                ).toFixed(2)}
                %
              </span>
            </Col> */}

            <Col xs={12} className="my-3">
              <label>Comment</label>
              <textarea
                rows={3}
                onChange={(e) => setApproverComment(e.target.value)}
              />
            </Col>
            <p className="error-message">{errorMessage}</p>
          </Row>
          <div className="d-flex justify-content-center">
            <div className="mx-1">
              <ReactiveButton
                buttonState="idle"
                idleText={'Approve'}
                outline
                color="green"
                className="rounded-1 py-1 px-3"
                onClick={() => {
                  handleApproval(true);
                }}
              />
            </div>
            <div className="mx-1">
              <ReactiveButton
                buttonState="idle"
                idleText={'Reject'}
                outline
                color="red"
                className="rounded-1 py-1 px-3"
                onClick={() => {
                  handleApproval(false);
                }}
              />
            </div>
            <div className="mx-1">
              <ReactiveButton
                buttonState="idle"
                idleText={'Cancel'}
                outline
                color="yellow"
                className="rounded-1 py-1 px-3"
                onClick={() => {
                  setShowApproval(false);
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PendingActions;
