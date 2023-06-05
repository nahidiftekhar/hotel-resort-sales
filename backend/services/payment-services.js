const dbStandard = require('./db-services/db-standard');
const helper = require('../services/utils/helper');
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

async function addPurchasePayment(req, res, next) {
  const {
    amount,
    paymentMethod,
    paymentNotes,
    visitId,
    paymentReceiver,
    userId,
  } = req.body.payment;

  const dbResult = await dbStandard.addSingleRecordDB(payments, {
    amount: amount,
    payment_method: paymentMethod,
    payment_notes: paymentNotes,
    visit_id: visitId,
    payment_receiver: paymentReceiver,
    user_id: userId || orgConfig.orgConfig.DEFAULT_USER_ID,
  });

  return res.json(dbResult);
}

module.exports = { addPurchasePayment, listAllPayment };
