import { formatDateYYYYMMDDwithDash } from '@/components/_functions/date-functions';
import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Export, downloadCSV } from '@/components/_functions/table-export';

const ItemPurchased = ({ items, day, loading }) => {
  const headerResponsive = [
    {
      name: 'Product',
      selector: (row) => row.product?.name,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Quantity Purchased',
      selector: (row) => row.total_quantity,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Total Cost',
      selector: (row) => row.total_cost,
      sortable: true,
      grow: 1,
    },
  ];

  const exportFileArray = items.map((item) => {
    return {
      Product: item.product?.name,
      'Quantity Purchased': item.total_quantity,
      'Total Cost': item.total_cost,
    };
  });

  const actionsMemo = useMemo(
    () => (
      <Export
        onExport={() => downloadCSV(exportFileArray, 'Purchase_Report.csv')}
      />
    ),
    [exportFileArray]
  );

  return (
    <div>
      <DataTable
        title={`Items Purchased on ${formatDateYYYYMMDDwithDash(day)}`}
        columns={headerResponsive}
        data={items}
        pagination={true}
        defaultSortField="product.name"
        defaultSortAsc={true}
        striped={true}
        highlightOnHover={true}
        responsive={true}
        progressPending={loading}
        paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
        actions={actionsMemo}
      />
    </div>
  );
};

export default ItemPurchased;
