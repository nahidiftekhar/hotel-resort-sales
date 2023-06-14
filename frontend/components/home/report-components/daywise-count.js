import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SquareLoader } from 'react-spinners';
import { Container } from 'react-bootstrap';

import { formatDateYYYYMMDD } from '@/components/_functions/common-functions';
import { dateArrayForChart } from '@/components/_functions/date-functions';

function DaywiseCount({ session }) {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateArray, setDateArray] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const date = new Date();
    const dateString = formatDateYYYYMMDD(date);
    const duration = -7;
    const daywiseBookings = await axios.get(
      `/api/dashboard/sales-manager/daywise-bookingcount-api?dateString=${dateString}&duration=${duration}`
    );
    const daywiseCheckins = await axios.get(
      `/api/dashboard/sales-manager/daywise-checkincount-api?dateString=${dateString}&duration=${duration}`
    );
    setReportData({
      bookingCount: daywiseBookings.data,
      checkinCount: daywiseCheckins.data,
    });
    setDateArray(dateArrayForChart(date, duration));
    setIsLoading(false);
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daywise Booking and Check-ins (Last 7 Days)',
      },
    },
  };

  const labels = dateArray.map((obj) => obj.formattedDate);

  const data = {
    labels,
    datasets: [
      {
        label: 'Booking',
        data: dateArray.map((currentdate) => {
          const matchingObject = reportData.bookingCount.find(
            (obj) => obj.checkin_date === currentdate.yyyymmddFormat
          );
          return matchingObject ? parseInt(matchingObject.cnt) : 0;
        }),
        backgroundColor: 'rgba(224, 120, 0, 0.5)',
      },
      {
        label: 'Check-in',
        data: dateArray.map((currentdate) => {
          const matchingObject = reportData.checkinCount.find(
            (obj) => obj.checkin_date === currentdate.yyyymmddFormat
          );
          return matchingObject ? parseInt(matchingObject.cnt) : 0;
        }),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-30">
        <SquareLoader color="#e3f7fa" speedMultiplier={3} />
      </Container>
    );
  }

  return (
    <section className="my-3 border rounded-1 px-0 py-0 w-100">
      <Bar options={options} data={data} />
    </section>
  );
}

export default DaywiseCount;
