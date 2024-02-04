import React, { useState, useEffect } from "react";
import ExpenseReport from "@/components/reports/expense-report";
import RevenueReport from "@/components/reports/revenue-report";
import {
  formatDateYYYYMMDD,
  getCurrentMonthFirstAndLastDates,
} from "@/components/_functions/date-functions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const date = new Date();
// const dateString = formatDateYYYYMMDD(date);
// const duration = -30;

const ReportsHome = () => {
  const [dateRange, setDateRange] = useState([
    getCurrentMonthFirstAndLastDates().firstDate,
    getCurrentMonthFirstAndLastDates().lastDate,
  ]);
  const [startDate, endDate] = dateRange;
  const [dateString, setDateString] = useState(
    formatDateYYYYMMDD(getCurrentMonthFirstAndLastDates().lastDate)
  );
  const [duration, setDuration] = useState(
    (getCurrentMonthFirstAndLastDates().firstDate.getTime() -
      getCurrentMonthFirstAndLastDates().lastDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      <div className="d-flex justify-content-start custom-form my-3 w-100">
        <div className="w-200">
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
        <button
          className="btn btn-dark py-1 mx-2"
          onClick={() => {
            setDateString(formatDateYYYYMMDD(endDate));
            setDuration(
              (startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
            );
          }}
        >
          Get Report
        </button>
      </div>

      <div className="my-5">
        <ExpenseReport dateString={dateString} duration={duration} />
      </div>
      <div className="my-5">
        <RevenueReport dateString={dateString} duration={duration} />
      </div>
    </div>
  );
};

export default ReportsHome;
