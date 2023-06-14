const dbStandard = require('./db-services/db-standard');
const dbReports = require('./db-services/db-reports');
const helper = require('./utils/helper');
const {
  bookings,
  discounts,
  discountslabs,
  guests,
  credentials,
  visits,
  visitorexpenses,
  payments,
} = require('../database/models');
const { Op } = require('sequelize');

async function testService(req, res, next) {
  const dbResult = await dbStandard.findAllFilterDb(discounts, {
    approver_id: 1,
    approval_status: 'pendingApproval',
  });
  helper.generateReference(0);

  return res.json(dbResult);
}

async function dailyBooking(req, res, next) {
  const { offset } = req.params;
  const dateToSearch = helper.getDateWithOffset(offset);

  const dbResult = await dbStandard.findAllFilterDb(bookings, {
    checkin_date: dateToSearch,
  });

  return res.json(dbResult);
}

async function bookingsAllRecords(req, res, next) {
  const { dateString, duration } = req.params;

  const startDate = helper.parseDateString(dateString);
  const endDate = helper.getEndDateWithDuration(startDate, duration);

  const dbResult = await dbStandard.joinTwoTablesFilterDb(
    bookings,
    guests,
    discounts,
    {
      checkin_date: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    }
  );

  return res.json(dbResult);
}

async function dailyCheckin(req, res, next) {
  const { offset } = req.params;
  const dateToSearch = helper.getDateWithOffset(offset);

  const dbResult = await dbStandard.findAllFilterDb(visits, {
    checkin_date: dateToSearch,
  });

  return res.json(dbResult);
}

async function checkinsAllRecords(req, res, next) {
  const { dateString, duration } = req.params;

  const startDate = helper.parseDateString(dateString);
  const endDate = helper.getEndDateWithDuration(startDate, duration);

  const dbResult = await dbStandard.findAllFilterDb(bookings, {
    checkin_date: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
  });
  return res.json(dbResult);
}

async function exsitingGuests(req, res, next) {
  const dbResult = await dbStandard.joinThreeTablesFilterDb(
    visits,
    visitorexpenses,
    guests,
    payments,
    {
      is_settled: false,
    }
  );
  return res.json(dbResult);
}

async function daywiseBookingCount(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const dbResult = await dbStandard.countGroupByDb(bookings, 'checkin_date', {
    checkin_date: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
  });

  return res.json(dbResult);
}

async function daywiseCheckinCount(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const dbResult = await dbStandard.countGroupByDb(visits, 'checkin_date', {
    checkin_date: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
  });

  return res.json(dbResult);
}

async function bookingCountInDuration(req, res, next) {
  const { duration } = req.params;
  const startDate =
    Number(duration) > 0
      ? new Date()
      : helper.getEndDateWithDuration(new Date(), duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(new Date(), duration)
      : new Date();

  const dbResult = await dbStandard.countWithFilterDb(bookings, {
    checkin_date: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
  });

  return res.json(dbResult);
}

async function checkinCountInDuration(req, res, next) {
  const { duration } = req.params;
  const startDate =
    Number(duration) > 0
      ? new Date()
      : helper.getEndDateWithDuration(new Date(), duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(new Date(), duration)
      : new Date();

  const dbResult = await dbStandard.countWithFilterDb(visits, {
    checkin_date: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
  });

  return res.json(dbResult);
}

async function discountTotalInDuration(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const dbResult = await dbStandard.sumWithFilterDb(
    discounts,
    'total_discount',
    {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    }
  );

  return res.json(dbResult);
}

async function revenueTotalInDuration(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const dbResult = await dbReports.revenueTotal(startDate, endDate);

  return res.json(dbResult);
}

async function paymentTotalInDuration(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const dbResult = await dbStandard.sumWithFilterDb(payments, 'amount', {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
    refund_date: null,
    amount: { [Op.gte]: 0 },
    // payment_method: {[Op.neq]: 'Adjustment'}
  });

  return res.json(dbResult);
}

async function adjustmentTotalInDuration(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const dbResult = await dbStandard.sumWithFilterDb(payments, 'amount', {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
    refund_date: null,
    amount: { [Op.lt]: 0 },
    // payment_method: 'Adjustment'
  });

  return res.json(dbResult);
}

async function financialsTotalInDuration(req, res, next) {
  const { dateString, duration } = req.params;
  const refDate = helper.parseDateString(dateString);

  const startDate =
    Number(duration) > 0
      ? refDate
      : helper.getEndDateWithDuration(refDate, duration);
  const endDate =
    Number(duration) > 0
      ? helper.getEndDateWithDuration(refDate, duration)
      : refDate;

  const adjustmentTotal = await dbStandard.sumWithFilterDb(payments, 'amount', {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
    refund_date: null,
    amount: { [Op.lt]: 0 },
    // payment_method: 'Adjustment'
  });

  const paymentTotal = await dbStandard.sumWithFilterDb(payments, 'amount', {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
    refund_date: null,
    amount: { [Op.gte]: 0 },
    // payment_method: {[Op.neq]: 'Adjustment'}
  });

  const revenueTotal = await dbReports.revenueTotal(startDate, endDate);

  const discountTotal = await dbStandard.sumWithFilterDb(
    discounts,
    'total_discount',
    {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    }
  );

  return res.json({
    revenueTotal,
    paymentTotal,
    adjustmentTotal,
    discountTotal,
  });
}

async function revenueDailyInDuration(req, res, next) {
  const { dateString, duration } = req.params;

  const startDate = helper.parseDateString(dateString);
  const endDate = helper.getEndDateWithDuration(startDate, duration);

  const dbResult = await dbReports.revenueDaily(startDate, endDate);

  return res.json(dbResult);
}

async function paymentAllRecords(req, res, next) {
  const { dateString, duration } = req.params;

  const startDate = helper.parseDateString(dateString);
  const endDate = helper.getEndDateWithDuration(startDate, duration);

  const dbResult = await dbStandard.findAllFilterDb(payments, {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
    refund_date: null,
    amount: { [Op.gte]: 0 },
    // payment_method: {[Op.neq]: 'Adjustment'}
  });
  return res.json(dbResult);
}

async function adjustmentAllRecords(req, res, next) {
  const { dateString, duration } = req.params;

  const startDate = helper.parseDateString(dateString);
  const endDate = helper.getEndDateWithDuration(startDate, duration);

  const dbResult = await dbStandard.findAllFilterDb(payments, {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    },
    refund_date: null,
    amount: { [Op.lt]: 0 },
    // payment_method: {[Op.eq]: 'Adjustment'}
  });
  return res.json(dbResult);
}

async function salesPerformance(req, res, next) {
  const { dateString, duration } = req.params;

  const endDate = helper.parseDateString(dateString);
  const startDate = helper.getEndDateWithDuration(endDate, duration * -1);

  const dbResult = await dbReports.salesPerformanceDb(startDate, endDate);
  return res.json(dbResult);
}

async function pendingActions(req, res, next) {
  const { userId } = req.params;
  const pendingDiscountApprovals = await dbStandard.findAllFilterDb(discounts, {
    approver_id: userId,
    approval_status: 'pendingApproval',
  });

  return res.json({ pendingDiscountApprovals });
}

module.exports = {
  testService,
  dailyBooking,
  bookingsAllRecords,
  dailyCheckin,
  checkinsAllRecords,
  daywiseBookingCount,
  daywiseCheckinCount,
  bookingCountInDuration,
  checkinCountInDuration,
  discountTotalInDuration,
  revenueTotalInDuration,
  revenueDailyInDuration,
  paymentTotalInDuration,
  adjustmentTotalInDuration,
  paymentAllRecords,
  adjustmentAllRecords,
  exsitingGuests,
  salesPerformance,
  financialsTotalInDuration,
  pendingActions,
};
