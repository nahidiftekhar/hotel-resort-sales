import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { datetimeStringToDate } from '@/components/_functions/date-functions';
import { Icon } from '@/components/_commom/Icon';
import RequisitionByProduct from './requisition-by-product';

const StockStatus = () => {
  const [fullStock, setFullStock] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [singleItemData, setSingleItemData] = useState({});

  useEffect(() => {
    const getStockStatus = async () => {
      const stockStatus = await axios.get('/api/purchase/stock/full-stock');
      setFullStock(stockStatus.data);
    };
    getStockStatus();
  }, []);

  const handleShowModal = async (productId) => {
    const res = await axios.post('/api/purchase/stock/requisition-by-product', {
      productId: productId,
    });
    setSingleItemData(res.data);
    setShowModal(true);
  };

  const headerResponsive = [
    {
      name: 'Sl',
      selector: (row, index) => index + 1,
      width: '50px',
    },
    {
      name: 'Product Name',
      selector: (row) => row.product?.name,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity + ' ' + row.product?.unit,
      grow: 1,
    },
    {
      name: 'Last Updated',
      selector: (row) => datetimeStringToDate(row.updatedAt),
      wrap: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          className="btn btn-sm btn-dark my-1 px-2 "
          onClick={() => {
            handleShowModal(row.product_id);
          }}>
          <Icon nameIcon="FaEye" />
        </button>
      ),
      grow: 1,
    },
  ];

  return (
    <div>
      <DataTable
        title="Stock Status"
        columns={headerResponsive}
        data={fullStock}
        pagination
        highlightOnHover
        responsive
        striped
        dense
        defaultSortField="name"
        sortIcon={<i className="fas fa-arrow-down"></i>}
        paginationComponentOptions={{
          rowsPerPageText: 'Rows per page:',
          rangeSeparatorText: 'of',
          rowsPerPageOptions: [50, 100],
          rowsPerPage: 100,
          noRowsPerPage: false,
          selectAllRowsItem: false,
          selectAllRowsItemText: 'All',
        }}
        progressPending={fullStock.length === 0}
      />

      <RequisitionByProduct
        singleItemData={singleItemData}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default StockStatus;
