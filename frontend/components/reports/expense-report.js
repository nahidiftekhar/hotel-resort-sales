import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Export, downloadCSV } from '@/components/_functions/table-export';

const ExpenseReport = ({ dateString, duration }) => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await axios.post('/api/reports/daywise-expense-api', {
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
      name: 'Expense',
      selector: (row) => row.totalExpense,
      sortable: true,
      grow: 1,
    },
  ];

  const exportFileArray = reportData.map((item) => {
    return {
      Date: item.day,
      Expense: item.totalExpense,
    };
  });

  const actionsMemo = useMemo(
    () => (
      <Export onExport={() => downloadCSV(exportFileArray, 'Expense_Report')} />
    ),
    [exportFileArray]
  );

  return (
    <div>
      <DataTable
        title="Expense Report"
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

export default ExpenseReport;
