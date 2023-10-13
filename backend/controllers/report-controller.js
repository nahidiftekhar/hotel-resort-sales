const router = require('express').Router();
const reportServices = require('../services/report-services');

// test
router.get('/', reportServices.testService);

// All bookings on a particular day// http://localhost:3430/reports/daily-bookings/20230601/-3
router.get(
  '/daily-bookings/:dateString/:duration',
  reportServices.bookingsAllRecords
);

// All check-ins on a particular day// http://localhost:3430/reports/daily-checkins/-3
router.get(
  '/daily-checkins/:dateString/:duration',
  reportServices.checkinCountInDuration
);

// Daywise booking count http://localhost:3430/reports/daywise-bookings/20230515/60
router.get(
  '/daywise-bookings/:dateString/:duration',
  reportServices.daywiseBookingCount
);

// Existing guests
router.get('/existing-guests', reportServices.exsitingGuests);

// Daywise checkin.visist count http://localhost:3430/reports/daywise-checkins/20230515/60
router.get(
  '/daywise-checkins/:dateString/:duration',
  reportServices.daywiseCheckinCount
);

// Count of booking in defined time from today http://localhost:3430/reports/bookingcount/-61
router.get('/bookingcount/:duration', reportServices.bookingCountInDuration);

// Count of booking in defined time from today http://localhost:3430/reports/checkincount/-61
router.get('/checkincount/:duration', reportServices.checkinCountInDuration);

// Total discount in days
router.get(
  '/discountSum/:dateString/:duration',
  reportServices.discountTotalInDuration
);

// Total revenue in days
router.get(
  '/revenueSum/:dateString/:duration',
  reportServices.revenueTotalInDuration
);

// Daily revenue in days
router.get(
  '/revenueDaily/:dateString/:duration',
  reportServices.revenueDailyInDuration
);

// Daily expense in days
router.get(
  '/expenseDaily/:dateString/:duration',
  reportServices.expenseDailyInDuration
);

// Total payment in days
router.get(
  '/paymentSum/:dateString/:duration',
  reportServices.paymentTotalInDuration
);

// Total adjustment in days
router.get(
  '/adjustmentSum/:dateString/:duration',
  reportServices.adjustmentTotalInDuration
);

// All payment records in days http://localhost:3430/reports/payments/20230601/30
router.get('/payments/:dateString/:duration', reportServices.paymentAllRecords);

// Total adjustment in days http://localhost:3430/reports/adjustments/20230601/30
router.get(
  '/adjustments/:dateString/:duration',
  reportServices.adjustmentAllRecords
);

// Sales performance http://localhost:3430/reports/sales-performance/20230501/300
router.get(
  '/sales-performance/:dateString/:duration',
  reportServices.salesPerformance
);

//Revenue, payment, adjustment, discount in a fixed days
router.get(
  '/financials/:dateString/:duration',
  reportServices.financialsTotalInDuration
);

// Pending approval inbox
router.get('/pending-actions/:userId', reportServices.pendingActions);

// Userwise booking records
router.get(
  '/userwise-bookings/:userId/:dateString/:duration',
  reportServices.bookingByUser
);

// Userwise requisition records
router.get(
  '/userwise-items/:userId/:dateString/:duration',
  reportServices.itemsRequisitionByUser
);

// Userwise purchase records
router.get(
  '/userwise-purchases/:userId/:dateString/:duration',
  reportServices.purchaseRequisitionByUser
);

module.exports = router;
