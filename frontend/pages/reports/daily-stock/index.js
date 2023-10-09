import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import ItemFulfilled from './item-fulfilled';
import ItemPurchased from './item-purchased';
import 'react-datepicker/dist/react-datepicker.css';
import { datetimeStringToDateTime } from '@/components/_functions/string-format';
import { formatDateYYYYMMDD } from '@/components/_functions/date-functions';

const DailyStock = () => {
  const [itemsPurchased, setItemsPurchased] = useState([]);
  const [itemsFulfilled, setItemsFulfilled] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [dateString, setDateString] = useState('20231009');

  useEffect(() => {
    const getItemsPurchased = async () => {
      const res = await axios.post('/api/reports/daywise-items', {
        dateString: dateString,
      });
      setItemsPurchased(res.data.itemsPurchase);
      setItemsFulfilled(res.data.itemFullfilled);
    };
    getItemsPurchased();
  }, [dateString]);

  return (
    <div>
      <div className="d-flex justify-content-start custom-form my-3">
        <div className="w-200">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <button
          className="btn btn-dark py-1 mx-2"
          onClick={() => setDateString(formatDateYYYYMMDD(startDate))}>
          Get Report
        </button>
      </div>
      <ItemFulfilled items={itemsFulfilled} day={startDate} />
      <ItemPurchased items={itemsPurchased} day={startDate} />
    </div>
  );
};

export default DailyStock;
