import React, { useState, useMemo } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import DataTable from 'react-data-table-component';
import 'react-datepicker/dist/react-datepicker.css';
import ReactiveButton from 'reactive-button';

import {
  formatDateYYYYMMDDwithDash,
  getCurrentMonthFirstAndLastDates,
} from '@/components/_functions/date-functions';
import { Export, downloadCSV } from '@/components/_functions/table-export';

function InventoryReport() {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([
    getCurrentMonthFirstAndLastDates().firstDate,
    getCurrentMonthFirstAndLastDates().lastDate,
  ]);
  const [reportReady, setReportReady] = useState(false);

  const [startDate, endDate] = dateRange;

  const handleReport = async () => {
    const res = await axios.post('/api/reports/inventory-report-api', {
      startDate,
      endDate,
    });
    if (res.data.success) setReportData(res.data.result);
    setReportReady(true);
  };

  const headerResponsive = [
    {
      name: 'Product Name',
      selector: (row) => row.item_name,
      grow: 1,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Opening Stock',
      selector: (row) => row.opening_stock + ' ' + row.unit,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Total In',
      selector: (row) => row.total_in + ' ' + row.unit,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Total Out',
      selector: (row) => row.total_out + ' ' + row.unit,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Closing Stock',
      selector: (row) => row.closing_stock + ' ' + row.unit,
      wrap: true,
      sortable: true,
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const exportFileArray = reportData.map((item) => {
    return {
      'Product Name': item.item_name,
      'Opening Stock': item.opening_stock + ' ' + item.unit,
      'Total In': item.total_in + ' ' + item.unit,
      'Total Out': item.total_out + ' ' + item.unit,
      'Closing Stock': item.closing_stock + ' ' + item.unit,
    };
  });

  const actionsMemo = useMemo(
    () => (
      <Export
        onExport={() =>
          downloadCSV(
            exportFileArray,
            'Inventory Report: from ' +
              formatDateYYYYMMDDwithDash(startDate) +
              ' to ' +
              formatDateYYYYMMDDwithDash(endDate) +
              '.csv'
          )
        }
      />
    ),
    [endDate, exportFileArray, startDate]
  );

  return (
    <div>
      <div className="center-flex flex-column">
        <h1 className="text-center">Inventory Report</h1>
        <div className="my-3 custom-form d-flex">
          <div className="max-w-200px">
            <label className="">Select Date Range</label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              dateFormat="MMM d, yy"
              placeholderText="Select Date Range"
            />
          </div>
          <div className="d-flex align-items-end">
            <ReactiveButton
              color="indigo"
              idleText="Generate"
              className="mx-3 rounded"
              onClick={() => handleReport()}
            />
          </div>
        </div>
      </div>

      {reportReady === true && (
        <DataTable
          title="Daily Attendance Report"
          columns={headerResponsive}
          data={reportData}
          actions={actionsMemo}
          pagination
          paginationPerPage={50}
          paginationRowsPerPageOptions={[20, 50, 100, 200]}
          paginationComponentOptions={paginationComponentOptions}
          defaultSortFieldId={1}
          responsive
          striped
          highlightOnHover
          dense
        />
      )}
    </div>
  );
}

export default InventoryReport;
