import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const RevenueReport = ({ dateString, duration }) => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const apiData = await axios.post('/api/reports/daywise-revenue-api', {
        dateString,
        duration,
      });
      setReportData(apiData.data);
      setIsLoading(false);
    };
    fetchData();
  }, [dateString, duration]);

  const headerResponsive = [
    {
      name: 'Date',
      selector: (row) => row.day,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Revenue',
      selector: (row) => row.totalRevenue,
      sortable: true,
      grow: 1,
    },
  ];

  return (
    <div>
      <DataTable
        title="Revenue Report"
        columns={headerResponsive}
        data={reportData}
        pagination
        progressPending={isLoading}
        persistTableHead
      />
    </div>
  );
};

export default RevenueReport;
