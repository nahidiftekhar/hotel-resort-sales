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
  productpurchases,
  productrequisitions,
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

async function revenueDailyInDuration(req, res, next) {
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

  const dbResult = await dbReports.revenueDaily(startDate, endDate);

  return res.json(dbResult);
}

async function expenseDailyInDuration(req, res, next) {
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

  const dbResult = await dbReports.expenseDaily(startDate, endDate);
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

  const expenseTotal = await dbStandard.sumWithFilterDb(
    productpurchases,
    'actual_cost',
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
    expenseTotal,
  });
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

async function bookingByUser(req, res, next) {
  const { userId, dateString, duration } = req.params;
  const { startDate, endDate } = helper.getStartAndEndDateWithDuration(
    helper.parseDateString(dateString),
    Number(duration)
  );

  const dbResult = await dbReports.bookingByUserDb(userId, startDate, endDate);
  return res.json(dbResult);
}

async function itemsRequisitionByUser(req, res, next) {
  const { userId, dateString, duration } = req.params;
  const { startDate, endDate } = helper.getStartAndEndDateWithDuration(
    helper.parseDateString(dateString),
    Number(duration)
  );

  const dbResult = await dbReports.itemsRequisitionByUserDb(
    userId,
    startDate,
    endDate
  );

  return res.json(dbResult);
}

async function purchaseRequisitionByUser(req, res, next) {
  const { userId, dateString, duration } = req.params;
  const { startDate, endDate } = helper.getStartAndEndDateWithDuration(
    helper.parseDateString(dateString),
    Number(duration)
  );

  const dbResult = await dbReports.purchaseRequisitionByUserDb(
    userId,
    startDate,
    endDate
  );

  return res.json(dbResult);
}

async function stockReportByDate(req, res, next) {
  const { startDate, endDate } = req.body;

  try {
    const dbResult = await dbReports.stockReportByDateDb(startDate, endDate);

    const currentStock = dbResult.currentStock;
    const purchaseAfterEndDate = dbResult.purchaseAfterEndDate;
    const purchaseBetweenDates = dbResult.purchaseBetweenDates;
    const requisitionBetweenDates = dbResult.requisitionBetweenDates;

    const result = currentStock.map((stockItem) => {
      const itemPurchaseAfterEndDate =
        purchaseAfterEndDate
          .find((purchase) => purchase.product_id === stockItem.id)
          ?.get('total_quantity') || '0.00';
      const itemPurchaseBetweenDates =
        purchaseBetweenDates
          .find((purchase) => purchase.product_id === stockItem.id)
          ?.get('total_quantity') || '0.00';
      const itemRequisitionBetweenDates =
        requisitionBetweenDates
          .find((requisition) => requisition.product_id === stockItem.id)
          ?.get('total_quantity') || '0.00';

      const currentStockQuantity =
        parseFloat(stockItem.storestocks[0]?.quantity) || 0;
      const purchaseAfterEndDateQuantity =
        parseFloat(itemPurchaseAfterEndDate) || 0;
      const purchaseBetweenDatesQuantity =
        parseFloat(itemPurchaseBetweenDates) || 0;
      const requisitionBetweenDatesQuantity =
        parseFloat(itemRequisitionBetweenDates) || 0;

      const openingStock =
        currentStockQuantity -
        purchaseAfterEndDateQuantity -
        purchaseBetweenDatesQuantity;
      const totalIn = purchaseBetweenDatesQuantity;
      const totalOut = requisitionBetweenDatesQuantity;
      const closingStock = currentStockQuantity - purchaseAfterEndDateQuantity;

      return {
        id: stockItem.id,
        item_name: stockItem.name,
        unit: stockItem.unit,
        current_stock: currentStockQuantity,
        opening_stock: openingStock,
        total_in: totalIn,
        total_out: totalOut,
        closing_stock: closingStock,
      };
    });
    return res.json({ success: true, result });
  } catch (error) {
    console.log('Error occured: ' + error);
    return res.json({ success: false, error });
  }
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
  expenseDailyInDuration,
  paymentTotalInDuration,
  adjustmentTotalInDuration,
  paymentAllRecords,
  adjustmentAllRecords,
  exsitingGuests,
  salesPerformance,
  financialsTotalInDuration,
  pendingActions,
  bookingByUser,
  itemsRequisitionByUser,
  purchaseRequisitionByUser,
  stockReportByDate,
};
