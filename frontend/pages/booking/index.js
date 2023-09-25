import React, { useEffect, useState } from 'react';
import DataTable, { FilterComponent } from 'react-data-table-component';
import {
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Modal,
  Row,
  Col,
} from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';
import DiscountApproval from '@/components/discounts/discount-approval';
import AdvancedCreations from '@/components/advanced/create-advanced';
import ListAllGuests from '@/components/guests/list-all-guests';

import { listAllBookingApi } from '@/api/booking-api';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';
import BookingView from '@/components/booking/booking-view';

function BookingHome({ session }) {
  const [allBookings, setAllBookings] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referesh, setReferesh] = useState(false);
  const [showDiscountApporoval, setShowDiscountApporoval] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(0);

  useEffect(() => {
    const fetchAllBooking = async () => {
      const apiResult = await listAllBookingApi();
      setAllBookings(apiResult);
      setFilterData(apiResult);
      setIsLoading(false);
      setReferesh(false);
    };
    fetchAllBooking();
  }, [referesh]);

  const handleApproveDiscount = async (rowData) => {
    setDiscountData({
      ...rowData.discount,
      amount: rowData.amount,
      discountedAmount: rowData.discounted_amount,
    });
    setShowDiscountApporoval(true);
  };

  const handleCreateAdvanced = async (rowData) => {
    setDiscountData({
      ...rowData,
    });
    setShowAdvanced(true);
  };

  const headerResponsive = [
    {
      name: 'Booking Ref',
      selector: (row) => row.booking_ref,
      wrap: true,
    },
    {
      name: 'Check-in',
      selector: (row) => row.checkin_date,
      sortable: true,
      wrap: true,
      // width: '150px',
    },
    {
      name: 'Check-out',
      selector: (row) => row.checkout_date,
      sortable: true,
      // width: '150px',
    },
    {
      name: 'Guest',
      selector: (row) => (
        <div>
          <p className="my-1">{row.guest.name}</p>
          <p className="my-1">
            Phone: <strong>{row.guest.phone}</strong>
          </p>
          <p className="my-1">
            Email: <strong>{row.guest.email}</strong>
          </p>
          <p className="my-1">
            {row.guest.id_type}
            <strong>{`: ${row.guest.id_number}`}</strong>
          </p>
        </div>
      ),
      wrap: true,
      grow: 2,
    },
    {
      name: 'Booking Details',
      // width: '300px',
      selector: (row) => (
        <div>
          {row.components.packageDetails?.length && <strong>Package:</strong>}
          {row.components.packageDetails?.map((singlePackage, index) => (
            <OverlayTrigger
              key={index}
              trigger="click"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Header as="h3">{singlePackage.name}</Popover.Header>
                  <Popover.Body>
                    <p className="my-1">Adults: {singlePackage.adult_count}</p>
                    <p className="my-1">Kids: {singlePackage.kids_count}</p>
                    <p className="my-1">
                      Price:{' '}
                      {(singlePackage.adult_cost || 0) +
                        (singlePackage.kids_cost || 0)}
                    </p>
                  </Popover.Body>
                </Popover>
              }>
              <p className="mb-1 pointer-div">{singlePackage.name}</p>
            </OverlayTrigger>
          ))}
          {row.components.prixfixeDetails?.length && (
            <div className="mt-2">
              {' '}
              <strong>Prixfixe:</strong>
            </div>
          )}
          {row.components.prixfixeDetails?.map((singlePackage, index) => (
            <OverlayTrigger
              key={index}
              trigger="click"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Header as="h3">{singlePackage.name}</Popover.Header>
                  <Popover.Body>
                    <p className="my-1">
                      Count: {singlePackage.prixfixe_count}
                    </p>
                    <p className="my-1">
                      Price: {singlePackage.prixfixe_cost || 0}
                    </p>
                  </Popover.Body>
                </Popover>
              }>
              <p className="mb-1 pointer-div">{singlePackage.name}</p>
            </OverlayTrigger>
          ))}

          {row.components.alacarteDetails?.length && (
            <div className="mt-2">
              {' '}
              <strong>Alacarte:</strong>
            </div>
          )}
          {row.components.alacarteDetails?.map((singlePackage, index) => (
            <OverlayTrigger
              key={index}
              trigger="click"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Header as="h3">{singlePackage.name}</Popover.Header>
                  <Popover.Body>
                    <p className="my-1">
                      Count: {singlePackage.alacarte_count}
                    </p>
                    <p className="my-1">
                      Price: {singlePackage.alacarte_cost || 0}
                    </p>
                  </Popover.Body>
                </Popover>
              }>
              <p className="mb-1 pointer-div">{singlePackage.name}</p>
            </OverlayTrigger>
          ))}

          {row.components.roomDetails?.length && (
            <div className="mt-2">
              {' '}
              <strong>Rooms:</strong>
              {row.components.roomDetails?.map((singlePackage, index) => (
                <OverlayTrigger
                  key={index}
                  trigger="click"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Header as="h3">
                        {singlePackage.roomtype.room_type_name}-
                        {singlePackage.room_number}
                      </Popover.Header>
                      <Popover.Body>
                        <p className="my-1">
                          Price: {singlePackage.room_cost || 0}
                        </p>
                      </Popover.Body>
                    </Popover>
                  }>
                  <p className="mb-1 pointer-div">
                    {singlePackage.roomtype.room_type_name}-
                    {singlePackage.room_number}
                  </p>
                </OverlayTrigger>
              ))}
            </div>
          )}
        </div>
      ),
      wrap: true,
      grow: 3,
    },
    {
      name: 'Price (BDT)',
      selector: (row) => (
        <div>
          <p className="my-1">
            Status:{' '}
            <strong>{camelCaseToCapitalizedString(row.booking_status)}</strong>{' '}
          </p>

          <p className="my-1">
            Before discount: <strong>{Number(row.amount).toFixed(2)}</strong>{' '}
            BDT
          </p>
          <p className="my-1">
            Discount applied:{' '}
            <strong>
              {row.discount?.percentage_value
                ? Number(row.discount.percentage_value).toFixed(2)
                : 0}
            </strong>{' '}
            %
          </p>
          {row.discount?.approval_status ? (
            <p className="mt-0 m-2 text-muted">
              {camelCaseToCapitalizedString(row.discount?.approval_status)}
            </p>
          ) : (
            ''
          )}
          <p className="my-1">
            After discount:{' '}
            <strong>{Number(row.discounted_amount).toFixed(2)}</strong> BDT
          </p>

          <p className="my-1">
            Advanced amount:{' '}
            <strong>{Number(row.advanced_amount).toFixed(2)}</strong> BDT
          </p>
        </div>
      ),
      wrap: true,
      grow: 3,
    },
    {
      name: 'Actions',
      grow: 1,
      cell: (row) =>
        row.booking_status === 'cancelled' ? (
          <div className="reactive-button-wauto">
            <a href={`booking/show-booking?id=${row.id}`} className="my-1">
              <ReactiveButton
                buttonState="idle"
                idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 20 }} />}
                outline
                color="violet"
                className="rounded-1 py-1 px-3"
                onClick={() => {
                  setShowBooking(true);
                  setCurrentBookingId(row.id);
                }}
              />
            </a>
          </div>
        ) : (
          <div className="d-flex flex-column">
            {row.discount &&
              row.discount?.approval_status === 'pendingApproval' && (
                <div className="reactive-button-wauto my-1">
                  <ReactiveButton
                    buttonState="idle"
                    idleText={
                      <Icon nameIcon="FaPercentage" propsIcon={{ size: 20 }} />
                    }
                    outline
                    color="green"
                    className="rounded-1 py-1 px-3"
                    onClick={() => handleApproveDiscount(row)}
                  />
                </div>
              )}
            {''}
            {row.booking_status !== 'discountApprovalPending' &&
              row.booking_status !== 'discountRejected' && (
                <div className="reactive-button-wauto my-1">
                  <ReactiveButton
                    buttonState="idle"
                    idleText={
                      <Icon
                        nameIcon="HiCurrencyBangladeshi"
                        propsIcon={{ size: 20 }}
                      />
                    }
                    outline
                    color="blue"
                    className="rounded-1 py-1 px-3"
                    onClick={() => handleCreateAdvanced(row)}
                  />
                </div>
              )}

            {/* <div className="reactive-button-wauto">
              <ReactiveButton
                buttonState="idle"
                idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 20 }} />}
                outline
                color="violet"
                className="rounded-1 py-1 px-3"
                onClick={() => {
                  setShowBooking(true);
                  setCurrentBookingId(row.id);
                }}
              />
            </div> */}

            <a href={`booking/show-booking?id=${row.id}`} className="my-1">
              <div className="reactive-button-wauto">
                <ReactiveButton
                  buttonState="idle"
                  idleText={<Icon nameIcon="FaEdit" propsIcon={{ size: 20 }} />}
                  outline
                  color="dark"
                  className="rounded-1 py-1 px-3"
                />
              </div>
            </a>
          </div>
        ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const handleFilter = (e) => {
    const filterTemp = allBookings.filter((booking) => {
      if (e.target.value === '') {
        return booking;
      } else if (
        booking.guest?.name
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        booking.guest?.email
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        booking.guest?.phone
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        booking.guest?.id_number
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
        return booking;
    });
    setFilterData((current) => [...filterTemp]);
  };

  const subHeaderComponent = () => {
    return (
      <Row className="w-100">
        {/* <Col md={6} className="d-none d-md-block"></Col> */}
        <Col md={6} xs={12} className="d-flex my-2">
          <div className="mx-1 reactive-button-wauto">
            <ReactiveButton
              buttonState="idle"
              idleText={
                <div>
                  <span className="d-none d-md-block center-flex">All</span>
                  <Icon
                    nameIcon="FaList"
                    propsIcon={{ size: 15, className: 'd-md-none' }}
                  />
                </div>
              }
              size="small"
              className="rounded-1 bg-gradient"
              onClick={() => setFilterData(allBookings)}
            />
          </div>
          <div className="mx-1 reactive-button-wauto">
            <ReactiveButton
              buttonState="idle"
              idleText={
                <div>
                  <span className="d-none d-md-block center-flex">
                    Cancelled
                  </span>
                  <Icon
                    nameIcon="AiFillStop"
                    propsIcon={{ size: 15, className: 'd-md-none' }}
                  />
                </div>
              }
              size="small"
              className="rounded-1 bg-gradient"
              onClick={() =>
                setFilterData(
                  allBookings.filter(
                    (booking) => booking.booking_status === 'cancelled'
                  )
                )
              }
            />
          </div>
          <div className="mx-1 reactive-button-wauto">
            <ReactiveButton
              buttonState="idle"
              idleText={
                <div>
                  <span className="d-none d-md-block center-flex">
                    Confirmation Pending
                  </span>
                  <Icon
                    nameIcon="BsHourglassTop"
                    propsIcon={{ size: 15, className: 'd-md-none' }}
                  />
                </div>
              }
              size="small"
              className="rounded-1 bg-gradient"
              onClick={() =>
                setFilterData(
                  allBookings.filter(
                    (booking) =>
                      booking.booking_status === 'advancedPaymentPending'
                  )
                )
              }
            />
          </div>
          <div className="mx-1 reactive-button-wauto">
            <ReactiveButton
              buttonState="idle"
              idleText={
                <div>
                  <span className="d-none d-md-block center-flex">
                    Approval Pending
                  </span>
                  <Icon
                    nameIcon="FaPause"
                    propsIcon={{ size: 15, className: 'd-md-none' }}
                  />
                </div>
              }
              size="small"
              className="rounded-1 bg-gradient"
              onClick={() =>
                setFilterData(
                  allBookings.filter(
                    (booking) =>
                      booking.booking_status === 'discountApprovalPending'
                  )
                )
              }
            />
          </div>
        </Col>
        <Col md={6} xs={12}>
          <Form className="w-100">
            <Form.Group className="mb-3" controlId="searchString">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter name/email/phone/ID number to filter"
                onChange={(e) => handleFilter(e)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    );
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between mb-5">
        <h3 className="text-center">Booking Management</h3>
        <ReactiveButton
          buttonState="idle"
          idleText={<span className="fw-bold fs-6">Add Booking</span>}
          color="indigo"
          size="small"
          className="rounded-1 py-1 bg-gradient"
          onClick={() => setShowGuestModal(true)}
        />
      </div>

      <DataTable
        title="List of upcoming bookings"
        columns={headerResponsive}
        data={filterData}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        subHeader
        subHeaderComponent={subHeaderComponent()}
        responsive
        striped
        dense
      />

      <DiscountApproval
        show={showDiscountApporoval}
        setShow={setShowDiscountApporoval}
        discountData={discountData}
        setReferesh={setReferesh}
        session={session}
      />

      <AdvancedCreations
        show={showAdvanced}
        setShow={setShowAdvanced}
        bookingData={discountData}
        setReferesh={setReferesh}
        session={session}
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

      <Modal
        show={showGuestModal}
        size="xl"
        onHide={() => setShowGuestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Guest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListAllGuests />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default BookingHome;
