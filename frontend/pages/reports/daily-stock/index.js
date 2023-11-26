import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import ItemFulfilled from './item-fulfilled';
import ItemPurchased from './item-purchased';
import 'react-datepicker/dist/react-datepicker.css';
import { datetimeStringToDateTime } from '@/components/_functions/string-format';
import {
  formatDateYYYYMMDD,
  getCurrentMonthFirstAndLastDates,
} from '@/components/_functions/date-functions';

const DailyStock = () => {
  const [itemsPurchased, setItemsPurchased] = useState([]);
  const [itemsFulfilled, setItemsFulfilled] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState([
    getCurrentMonthFirstAndLastDates().firstDate,
    getCurrentMonthFirstAndLastDates().lastDate,
  ]);
  const [startDate, endDate] = dateRange;
  const [dateString, setDateString] = useState({
    startDate: startDate,
    endDate: endDate,
  });

  useEffect(() => {
    const getItemsPurchased = async () => {
      setLoading(true);
      const res = await axios.post('/api/reports/daywise-items', {
        startDatestring: formatDateYYYYMMDD(startDate),
        endDatestring: formatDateYYYYMMDD(endDate),
      });
      setItemsPurchased(res.data.itemsPurchase);
      setItemsFulfilled(res.data.itemFullfilled);
      setLoading(false);
    };
    getItemsPurchased();
  }, [dateString]);

  return (
    <div>
      <div className="d-flex justify-content-start custom-form my-3">
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
          onClick={() =>
            setDateString({
              startDate: startDate,
              endDate: endDate,
            })
          }>
          Get Report
        </button>
      </div>
      <ItemFulfilled
        items={itemsFulfilled}
        dateString={dateString}
        loading={loading}
      />
      <ItemPurchased
        items={itemsPurchased}
        dateString={dateString}
        loading={loading}
      />
    </div>
  );
};

export default DailyStock;
