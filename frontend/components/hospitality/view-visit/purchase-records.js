import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable, { FilterComponent } from 'react-data-table-component';
import { Container, Button, Form } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { roundUptoFixedDigits } from '@/components/_functions/common-functions';
import {
  datetimeStringToDate,
  datetimeStringToDateTime,
} from '@/components/_functions/string-format';

function PurchaseRecords({ purchaseRecords }) {
  const headerResponsive = [
    {
      name: 'Sl',
      selector: (row, index) => index + 1,
      sortable: true,
      // grow: 1,
      width: '100px',
    },
    {
      name: 'Item',
      selector: (row) => row.item_name,
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Type',
      selector: (row) => row.item_type,
      sortable: false,
      grow: 1,
    },
    {
      name: 'Count',
      selector: (row) => row.item_count,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Purchase Date',
      selector: (row) => datetimeStringToDateTime(row.createdAt),
      sortable: true,
      grow: 1,
    },
    {
      name: 'Price (BDT)',
      selector: (row) =>
        roundUptoFixedDigits(row.item_count * row.unit_price, 2),
      sortable: false,
      grow: 1,
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  return (
    <>
      <DataTable
        title="Purchase records"
        columns={headerResponsive}
        data={purchaseRecords.filter((item) => item.item_type !== 'Booking')}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />
    </>
  );
}

export default PurchaseRecords;
