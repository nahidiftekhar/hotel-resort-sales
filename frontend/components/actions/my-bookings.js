import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable from 'react-data-table-component';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';
import axios from 'axios';
import {
  datetimeStringToDate,
  formatDateYYYYMMDD,
} from '../_functions/date-functions';
import { camelCaseToCapitalizedString } from '../_functions/string-format';
import { roundUptoFixedDigits } from '../_functions/common-functions';

const MyBookings = ({ session }) => {
  const [myBookingList, setMyBookingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const conditionalRowStyles = [
    {
      when: (row) => row.booking_status === 'bookingConfirmed',
      style: {
        backgroundColor: '#d7ffe0',
      },
    },
    {
      when: (row) =>
        ['cancelled', 'discountRejected'].includes(row.booking_status),
      style: (row) => ({
        backgroundColor: '#ffd7e0',
      }),
    },
  ];

  const columns = [
    {
      name: 'Booking Ref',
      selector: (row) => (
        <p className="fs-xs fw-bold my-0">{row.booking_ref}</p>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Booking Schedule',
      selector: (row) => (
        <div>
          <p className="my-1">
            <span>Check-in: </span>
            {row.checkin_date}
          </p>
          <p className="my-1">
            <span>Check-out: </span>
            {row.checkout_date}
          </p>
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Booking Status',
      selector: (row) => (
        <p className="fs-xs fw-bold my-0">
          {camelCaseToCapitalizedString(row.booking_status)}
        </p>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Amount',
      selector: (row) => (
        <div className="text-end">
          <p className="my-1">
            <span>Shelf Rate: </span>
            {roundUptoFixedDigits(row.amount, 2)}
          </p>
          <p className="my-1">
            <span>Discounted Amount: </span>
            {roundUptoFixedDigits(row.discounted_amount, 2)}
          </p>
        </div>
      ),
      sortable: true,
      right: true,
      grow: 2,
    },
    {
      name: 'Created At',
      selector: (row) => datetimeStringToDate(row.createdAt),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Actions',
      grow: 1,
      cell: (row) => (
        <a href={`booking/show-booking?id=${row.id}`} className="my-1">
          <div className="reactive-button-wauto">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 20 }} />}
              outline
              color="dark"
              className="rounded-1 py-1 px-3"
            />
          </div>
        </a>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const res = await axios.post('/api/my-activities/list-bookings', {
        userId: session.user.id,
        dateString: formatDateYYYYMMDD(today),
        duration: -60,
      });

      setMyBookingList(res.data);
      setLoading(false);
    };
    if (session) {
      fetchData();
    }
  }, [session]);
  return (
    <div>
      <DataTable
        title="My Bookings"
        columns={columns}
        data={myBookingList}
        pagination
        paginationPerPage={20}
        progressPending={loading}
        progressComponent={<PropagateLoader />}
        striped
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
      />
    </div>
  );
};

export default MyBookings;
