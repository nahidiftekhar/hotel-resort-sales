import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { SquareLoader } from 'react-spinners';
import { Container } from 'react-bootstrap';

import {
  formatDateYYYYMMDD,
  sumOfKey,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import { BDTFormat } from '@/components/_functions/number-format';

function SalesPerformance({ session }) {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (dateString, duration) => {
    const date = new Date();
    dateString = dateString || formatDateYYYYMMDD(date);
    duration = duration || 30;
    const apiData = await axios.get(
      `/api/dashboard/sales-manager/sales-performance-api?dateString=${dateString}&duration=${duration}`
    );
    setReportData(apiData.data);
    setIsLoading(false);
    setEndDate(dateString);
  };

  const headerResponsive = [
    {
      name: 'User Name',
      selector: (row) => row.username,
      wrap: true,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Total',
      selector: (row) => row.total_count,
      sortable: true,
      grow: 1,
      right: true,
    },
    {
      name: 'Cancelled',
      selector: (row) => row.cancelled_booking,
      wrap: true,
      grow: 1,
      right: true,
    },
    {
      name: 'Booking Value',
      selector: (row) => BDTFormat.format(row.booking_amount),
      wrap: true,
      grow: 2,
      right: true,
    },
    {
      name: 'Discount Value',
      selector: (row) => BDTFormat.format(row.total_discount),
      wrap: true,
      grow: 2,
      right: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) =>
        (sumOfKey(row.payments, 'amount') || 0) /
          (sumOfKeyMultiply(row.visitorexpenses, 'unit_price', 'item_count') ||
            0) <
        0.5,
      style: {
        backgroundColor: '#ffffbb',
        // color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: (row) =>
        (sumOfKey(row.payments, 'amount') || 0) /
          (sumOfKeyMultiply(row.visitorexpenses, 'unit_price', 'item_count') ||
            0) <
        0.25,
      style: {
        backgroundColor: '#ffbbbb',
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
        title={`Sales Performance for 30 days upto ${endDate}`}
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

export default SalesPerformance;
