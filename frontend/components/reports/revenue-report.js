import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Export, downloadCSV } from '@/components/_functions/table-export';
import { numberToIndianFormat } from '../_functions/number-format';

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
      selector: (row) => numberToIndianFormat(row.totalRevenue),
      sortable: true,
      grow: 1,
      right: true,
    },
  ];

  const exportFileArray = reportData.map((item) => {
    return {
      Date: item.day,
      Revenue: item.totalRevenue,
    };
  });

  const actionsMemo = useMemo(() => {
    return (
      <Export onExport={() => downloadCSV(exportFileArray, 'Revenue Report')} />
    );
  }, [exportFileArray]);

  return (
    <div className='w-md-50'>
      <DataTable
        title="Revenue Report"
        columns={headerResponsive}
        data={reportData}
        pagination
        progressPending={isLoading}
        persistTableHead
        actions={actionsMemo}
      />
    </div>
  );
};

export default RevenueReport;
