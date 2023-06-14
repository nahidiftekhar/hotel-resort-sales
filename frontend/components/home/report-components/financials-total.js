import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { SquareLoader } from 'react-spinners';
import { Container } from 'react-bootstrap';

import { formatDateYYYYMMDD } from '@/components/_functions/common-functions';

function FinancialsTotal({ session }) {
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
    const financials = await axios.get(
      `/api/dashboard/sales-manager/financials-total-api?dateString=${dateString}&duration=${duration}`
    );
    setReportData(financials.data);
    setIsLoading(false);
  };

  ChartJS.register(
    CategoryScale,
    ArcElement,
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
        text: 'Financials for Last 7 Days',
      },
    },
  };

  const labels = ['Revenue', 'Discount', 'Adjustment'];

  const data = {
    labels,
    datasets: [
      {
        label: 'BDT',
        data: [
          reportData.revenueTotal?.totalRevenue,
          reportData.discountTotal,
          reportData.adjustmentTotal * -1,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
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
    <section className="my-3 border rounded-1 px-0 py-2 w-100">
      {/* {JSON.stringify(reportData)} */}
      <Pie data={data} options={options} />
    </section>
  );
}

export default FinancialsTotal;
