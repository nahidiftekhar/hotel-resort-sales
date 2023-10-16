import { formatDateYYYYMMDDwithDash } from '@/components/_functions/date-functions';
import React from 'react';
import DataTable from 'react-data-table-component';

const ItemFulfilled = ({ items, day, loading }) => {
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

  return (
    <div>
      <DataTable
        title={`Items Fulfilled on ${formatDateYYYYMMDDwithDash(day)}`}
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
      />
    </div>
  );
};

export default ItemFulfilled;
