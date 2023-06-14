import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable, { FilterComponent } from 'react-data-table-component';
import { SquareLoader } from 'react-spinners';
import ReactiveButton from 'reactive-button';
import { Container, OverlayTrigger, Popover } from 'react-bootstrap';

import { Icon } from '@/components/_commom/Icon';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';
import { formatDateYYYYMMDD } from '@/components/_functions/common-functions';
import {
  BDTFormat,
  roundUptoFixedDigits,
} from '@/components/_functions/number-format';

function UpcomingBooking({ session }) {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const dateString = formatDateYYYYMMDD(new Date());
      const duration = 7;
      const apiData = await axios.post(
        '/api/dashboard/sales-manager/upcoming-booking-api',
        { dateString, duration }
      );

      setReportData(apiData.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const headerResponsive = [
    {
      name: 'Booking Ref',
      selector: (row) => row.booking_ref,
      wrap: true,
      grow: 1,
    },
    {
      name: 'Check-in',
      selector: (row) => row.checkin_date,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: 'Guest',
      selector: (row) => (
        <div>
          <OverlayTrigger
            trigger="click"
            overlay={
              <Popover id="popover-basic">
                <Popover.Header as="h3">{row.guest?.name}</Popover.Header>
                <Popover.Body>
                  <p className="my-1">
                    Phone: <strong>{row.guest?.phone}</strong>
                  </p>
                  <p className="my-1">
                    Email: <strong>{row.guest?.email}</strong>
                  </p>
                  <p className="my-1">
                    {row.guest?.id_type}
                    <strong>{`: ${row.guest?.id_number}`}</strong>
                  </p>
                </Popover.Body>
              </Popover>
            }>
            <p className="my-1 fw-bold pointer-div">{row.guest?.name}</p>
          </OverlayTrigger>
        </div>
      ),
      wrap: true,
      grow: 1,
    },
    {
      name: 'Status',
      selector: (row) => camelCaseToCapitalizedString(row.booking_status),
      wrap: true,
      grow: 1,
    },
    {
      name: 'Value',
      right: true,
      selector: (row) => (
        <div>
          <OverlayTrigger
            trigger="click"
            overlay={
              <Popover id="popover-basic">
                <Popover.Header as="h3">Booking Value</Popover.Header>
                <Popover.Body>
                  <p className="my-1">
                    Shelf Rate: <strong>{BDTFormat.format(row.amount)}</strong>
                  </p>
                  <p className="my-1">
                    Discount Amount:{' '}
                    <strong>
                      {BDTFormat.format(row.amount - row.discounted_amount)}
                    </strong>
                  </p>
                  <p className="my-1">
                    Discounted Amount:{' '}
                    <strong>{BDTFormat.format(row.discounted_amount)}</strong>
                  </p>
                  <p className="my-1">
                    Advanced Amount:{' '}
                    <strong>{BDTFormat.format(row.advanced_amount)}</strong>
                  </p>
                </Popover.Body>
              </Popover>
            }>
            <p className="my-1 fw-bold pointer-div">
              {roundUptoFixedDigits(row.discounted_amount, 2)}
            </p>
          </OverlayTrigger>
        </div>
      ),
      wrap: true,
      grow: 1,
    },
    {
      name: 'Actions',
      right: true,
      grow: 1,
      cell: (row) => (
        <a href={`booking/show-booking?id=${row.id}`} className="my-1">
          <div className="reactive-button-wauto">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 20 }} />}
              outline
              color="dark"
              className="rounded-1 py-1 px-2"
            />
          </div>
        </a>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.booking_status === 'advancedPaymentPending',
      style: {
        backgroundColor: '#ffffbb',
        // color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: (row) => row.booking_status === 'discountRejected',
      style: {
        backgroundColor: '#ffe0e0',
        // color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-30">
        <SquareLoader color="#e3f7fa" speedMultiplier={3} />
      </Container>
    );
  }

  return (
    <section className="my-3 border rounded-1 px-3 py-0">
      <DataTable
        title="List of upcoming bookings"
        columns={headerResponsive}
        data={reportData}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        conditionalRowStyles={conditionalRowStyles}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />
    </section>
  );
}

export default UpcomingBooking;
