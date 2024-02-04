import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Export, downloadCSV } from "@/components/_functions/table-export";
import { numberToIndianFormat } from "../_functions/number-format";

const ExpenseReport = ({ dateString, duration }) => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await axios.post("/api/reports/daywise-expense-api", {
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
      name: "Date",
      selector: (row) => row.day,
      sortable: true,
      grow: 1,
    },
    {
      name: "Expense",
      selector: (row) => numberToIndianFormat(row.totalExpense),
      sortable: true,
      grow: 1,
      right: true,
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
      <Export onExport={() => downloadCSV(exportFileArray, "Expense_Report")} />
    ),
    [exportFileArray]
  );

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  return (
    <div className="w-md-50">
      <DataTable
        title="Expense Report"
        columns={headerResponsive}
        data={reportData}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        paginationPerPage={30}
        paginationRowsPerPageOptions={[30, 50, 100]}
        progressPending={isLoading}
        persistTableHead
        actions={actionsMemo}
      />
    </div>
  );
};

export default ExpenseReport;
