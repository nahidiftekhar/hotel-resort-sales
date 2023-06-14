import React from 'react';
import DataTable, { FilterComponent } from 'react-data-table-component';
import {
  roundUptoFixedDigits,
  sumOfKeyMultiply,
} from '@/components/_functions/common-functions';
import { datetimeStringToDateTime } from '@/components/_functions/string-format';
import { BDTFormat } from '@/components/_functions/number-format';

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
      name: 'Purchase Date',
      selector: (row) => datetimeStringToDateTime(row.createdAt),
      sortable: true,
      grow: 1,
    },
    {
      name: 'Count',
      selector: (row) => row.item_count,
      sortable: true,
      right: true,
      grow: 1,
    },
    {
      name: 'Price (BDT)',
      selector: (row) =>
        roundUptoFixedDigits(row.item_count * row.unit_price, 2),
      sortable: false,
      right: true,
      grow: 1,
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  return (
    <div className="border border-dark border-opacity-75">
      {/* <div className="p-2 fw-bold bg-light">
        <span className="me-5">Purchase Records</span>
      </div> */}

      <div className="p-2 d-flex justify-content-between fw-bold bg-light">
        <span className="me-5">Purchase Records</span>
        <span>
          {BDTFormat.format(
            sumOfKeyMultiply(purchaseRecords, 'unit_price', 'item_count') || 0
          )}
        </span>
      </div>

      <DataTable
        // title="Purchases"
        columns={headerResponsive}
        data={purchaseRecords.filter((item) => item.item_type !== 'Booking')}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />
    </div>
  );
}

export default PurchaseRecords;
