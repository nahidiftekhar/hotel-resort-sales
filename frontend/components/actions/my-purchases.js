import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import {
  datetimeStringToDate,
  formatDateYYYYMMDD,
} from '../_functions/date-functions';
import { camelCaseToCapitalizedString } from '../_functions/string-format';
import { roundUptoFixedDigits } from '../_functions/common-functions';

const MyPurchases = ({ session }) => {
  const [myItemList, setMyItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const res = await axios.post('/api/my-activities/list-purchases', {
        userId: session.user.id,
        dateString: formatDateYYYYMMDD(today),
        duration: -60,
      });

      setMyItemList(res.data);
      setLoading(false);
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  const conditionalRowStyles = [
    {
      when: (row) => ['purchased', 'approved', 'released'].includes(row.status),
      style: {
        backgroundColor: '#d7ffe0',
      },
    },
    {
      when: (row) => ['rejected'].includes(row.status),
      style: (row) => ({
        backgroundColor: '#ffd7e0',
      }),
    },
  ];

  const columns = [
    {
      name: 'Created At',
      selector: (row) => datetimeStringToDate(row.createdAt),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Product Name',
      selector: (row) => row.product?.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity + ' ' + row.product?.unit,
    },
    {
      name: 'Budget',
      selector: (row) => (
        <p className="fs-xs fw-bold my-0">
          {roundUptoFixedDigits(row.price, 2)}
        </p>
      ),
    },
    {
      name: 'Actual Cost',
      selector: (row) => (
        <p className="fs-xs fw-bold my-0">
          {roundUptoFixedDigits(row.actual_cost, 2)}
        </p>
      ),
    },

    {
      name: 'Requisition Status',
      selector: (row) => (
        <p className="fs-xs fw-bold my-0">
          {camelCaseToCapitalizedString(row.status)}
        </p>
      ),
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <div>
      <DataTable
        title="My Purchase Requests"
        columns={columns}
        data={myItemList}
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

export default MyPurchases;
