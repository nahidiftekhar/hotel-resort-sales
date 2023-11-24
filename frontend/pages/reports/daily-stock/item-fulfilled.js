import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Export, downloadCSV } from '@/components/_functions/table-export';
import { formatDateYYYYMMDDwithDash } from '@/components/_functions/date-functions';

const ItemFulfilled = ({ items, dateString, loading }) => {
  const headerResponsive = [
    {
      name: 'Product',
      selector: (row) => row.product?.name,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Quantity Fulfilled',
      selector: (row) => row.total_quantity,
      sortable: true,
      grow: 1,
    },
  ];

  const exportFileArray = items.map((item) => {
    return {
      Product: item.product?.name,
      'Quantity Fulfilled': item.total_quantity,
    };
  });

  const actionsMemo = useMemo(
    () => (
      <Export
        onExport={() => downloadCSV(exportFileArray, 'Fulfilled_Report')}
      />
    ),
    [exportFileArray]
  );

  return (
    <div>
      <DataTable
        title={`Items Purchased from ${formatDateYYYYMMDDwithDash(
          dateString?.startDate
        )} to ${formatDateYYYYMMDDwithDash(dateString?.endDate)}`}
        columns={headerResponsive}
        data={items}
        pagination={true}
        defaultSortField="product.name"
        defaultSortAsc={true}
        striped={true}
        highlightOnHover={true}
        responsive={true}
        paginationPerPage={50}
        progressPending={loading}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
        actions={actionsMemo}
      />
    </div>
  );
};

export default ItemFulfilled;
