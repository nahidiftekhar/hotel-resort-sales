const dbStandard = require('./db-services/db-standard');
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
const orgConfig = require('../configs/org.config');

async function listAllPayment(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(payments);
  helper.generateReference(0);

  return res.json(dbResult);
}

async function dailyBooking(req, res, next) {
  const dbResult = await dbStandard.findAllFilterDb();
}

module.exports = { listAllPayment };
