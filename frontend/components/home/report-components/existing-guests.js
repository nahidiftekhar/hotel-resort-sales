import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable, { FilterComponent } from 'react-data-table-component';
import { SquareLoader } from 'react-spinners';
import ReactiveButton from 'reactive-button';
import { Container, OverlayTrigger, Popover } from 'react-bootstrap';

import { Icon } from '@/components/_commom/Icon';
import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';
import {
  formatDateYYYYMMDD,
  sumOfKey,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import {
  BDTFormat,
  roundUptoFixedDigits,
} from '@/components/_functions/number-format';

function ExistingGuests({ session }) {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await axios.get(
        '/api/dashboard/sales-manager/existing-guests-api'
      );

      setReportData(apiData.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const headerResponsive = [
    {
      name: 'Check-in Ref',
      selector: (row) => row.visit_ref,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Date',
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
      grow: 3,
    },
    {
      name: 'Expense',
      selector: (row) =>
        roundUptoFixedDigits(
          sumOfKeyMultiply(row.visitorexpenses, 'unit_price', 'item_count') ||
            0,
          2
        ),
      wrap: true,
      grow: 2,
      right: true,
    },
    {
      name: 'Payment',
      selector: (row) =>
        roundUptoFixedDigits(sumOfKey(row.payments, 'amount') || 0, 2),
      wrap: true,
      grow: 2,
      right: true,
    },
    {
      name: 'Actions',
      grow: 1,
      right: true,
      cell: (row) => (
        <a href={`/hospitality/view-visit?id=${row.id}`}>
          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              color="dark"
              outline
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 16 }} />}
              className="rounded-1 px-2 py-1 bg-gradient"
            />
          </div>
        </a>
      ),
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
        title="List of existing guests"
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

export default ExistingGuests;
