import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { datetimeStringToDate } from '@/components/_functions/date-functions';
import { Icon } from '@/components/_commom/Icon';
import RequisitionByProduct from './requisition-by-product';
import { Form } from 'react-bootstrap';

const StockStatus = () => {
  const [fullStock, setFullStock] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [singleItemData, setSingleItemData] = useState({});

  useEffect(() => {
    const getStockStatus = async () => {
      const stockStatus = await axios.get('/api/purchase/stock/full-stock');
      setFullStock(stockStatus.data);
      setFilterData(stockStatus.data);
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

  const handleFilter = (e) => {
    const filterTemp = fullStock.filter((item) => {
      if (e.target.value === '') {
        return item;
      } else if (
        item.product?.name?.toLowerCase().includes(e.target.value.toLowerCase())
      )
        return item;
    });
    setFilterData((current) => [...filterTemp]);
  };

  const subHeaderComponent = () => {
    return (
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="searchString">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter item name to filter"
            onChange={(e) => handleFilter(e)}
          />
        </Form.Group>
      </Form>
    );
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  return (
    <div>
      <DataTable
        title="Stock Status"
        columns={headerResponsive}
        data={filterData}
        pagination
        highlightOnHover
        responsive
        striped
        dense
        defaultSortField={2}
        sortIcon={<i className="fas fa-arrow-down"></i>}
        paginationPerPage={100}
        paginationRowsPerPageOptions={[50, 100, 500]}
        paginationComponentOptions={paginationComponentOptions}
        progressPending={fullStock.length === 0}
        subHeader
        subHeaderComponent={subHeaderComponent()}
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
