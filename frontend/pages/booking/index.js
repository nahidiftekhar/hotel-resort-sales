import React, { useEffect, useState } from 'react';
import DataTable, { FilterComponent } from 'react-data-table-component';
import {
  Container,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
  Overlay,
  Popover,
} from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';

import { Icon } from '@/components/_commom/Icon';
import { downloadExcel } from '@/components/_functions/downloadExcel';

import { listAllBookingApi } from '@/api/booking-api';
import DiscountApproval from '@/components/discounts/discount-approval';

function BookingHome() {
  const [allBookings, setAllBookings] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referesh, setReferesh] = useState(false);
  const [showDiscountApporoval, setShowDiscountApporoval] = useState(false);

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

  const headerResponsive = [
    {
      name: 'ID',
      selector: (row) => row.id,
      width: '50px',
    },
    {
      name: 'Check-in',
      selector: (row) => row.checkin_date,
      sortable: true,
      wrap: true,
      width: '150px',
    },
    {
      name: 'Check-out',
      selector: (row) => row.checkout_date,
      sortable: true,
      width: '150px',
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
    },
    {
      name: 'Booking Details',
      // width: '300px',
      selector: (row) => (
        <div>
          {row.components.packageDetails?.length && <strong>Package:</strong>}
          {row.components.packageDetails.map((singlePackage, index) => (
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
            </div>
          )}
          {row.components.roomDetails?.map((singlePackage, index) => (
            <OverlayTrigger
              key={index}
              trigger="click"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Header as="h3">{singlePackage.name}</Popover.Header>
                  <Popover.Body>
                    <p className="my-1">Count: {singlePackage.room_count}</p>
                    <p className="my-1">
                      Price: {singlePackage.room_cost || 0}
                    </p>
                  </Popover.Body>
                </Popover>
              }>
              <p className="mb-1 pointer-div">{singlePackage.name}</p>
            </OverlayTrigger>
          ))}
        </div>
      ),
      wrap: true,
    },
    {
      name: 'Price (BDT)',
      selector: (row) => (
        <div>
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
              {row.discount?.approval_status}
            </p>
          ) : (
            ''
          )}
          <p className="my-1">
            After discount:{' '}
            <strong>{Number(row.discounted_amount).toFixed(2)}</strong> BDT
          </p>
        </div>
      ),
      wrap: true,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          {row.discount &&
            row.discount?.approval_status === 'pendingApproval' && (
              <Button
                size="sm"
                variant="dark"
                className="mx-1 py-1 px-md-2 px-1 d-inline-flex align-items-center"
                onClick={() => handleApproveDiscount(row)}>
                <Icon nameIcon="FaPercentage" propsIcon={{ size: 12 }} />
              </Button>
            )}{' '}
          <a href={`/edit-guest?id=${row.id}`}>
            <Button
              size="sm"
              variant="success"
              className="mx-1 py-1 px-md-2 px-1 d-inline-flex align-items-center">
              <Icon nameIcon="FaPlus" propsIcon={{ size: 12 }} />
            </Button>
          </a>
          <Button
            size="sm"
            variant="secondary"
            className="mx-1 py-1 px-md-2 px-1 d-inline-flex align-items-center"
            onClick={() => {
              setShowModGuestModal(true);
              setModGuestData(row);
            }}>
            <Icon nameIcon="FaEdit" propsIcon={{ size: 12 }} />
          </Button>
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
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="searchString">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter name/email/phone/ID number to filter"
            onChange={(e) => handleFilter(e)}
          />
        </Form.Group>
      </Form>
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
      <h3 className="text-center">Booking Management</h3>
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
      />
    </div>
  );
}

export default BookingHome;
