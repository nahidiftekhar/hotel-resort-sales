import { formatDateYYYYMMDD } from '@/components/_functions/date-functions';
import ExpenseReport from '@/components/reports/expense-report';
import RevenueReport from '@/components/reports/revenue-report';
import React from 'react';

const date = new Date();
const dateString = formatDateYYYYMMDD(date);
const duration = -30;

const ReportsHome = () => {
  return (
    <div>
      <ExpenseReport dateString={dateString} duration={duration} />
      <RevenueReport dateString={dateString} duration={duration} />
    </div>
  );
};

export default ReportsHome;
