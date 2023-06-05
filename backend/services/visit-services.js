const dbStandard = require('./db-services/db-standard');
const {
  bookings,
  discounts,
  discountslabs,
  guests,
  visits,
  visitorexpenses,
  payments,
} = require('../database/models');
const helper = require('../services/utils/helper');
const orgConfig = require('../configs/org.config');
const { Op } = require('sequelize');

async function createCheckin(req, res, next) {
  const {
    checkinDate,
    checkoutDate,
    roomId,
    bookigId,
    advancedAmount,
    amount,
    guestIdArray,
    guestId,
    notes,
    userId,
  } = req.body;

  const uniqueRef = await helper.generateReference(0);

  const dbResult = await dbStandard.addSingleRecordDB(visits, {
    checkin_date: checkinDate,
    checkout_date: checkoutDate,
    room_number: roomId,
    guest_id: guestId,
    additional_guests: guestIdArray,
    visit_notes: notes,
    booking_id: bookigId,
    advanced_amount: advancedAmount,
    visit_ref: uniqueRef,
    user_id: userId || orgConfig.orgConfig.DEFAULT_USER_ID,
  });
  const visitId = dbResult.dbResult.id;

  // Add booking amount as an expense
  const addExpense = await dbStandard.addSingleRecordDB(visitorexpenses, {
    item_type: 'Booking',
    item_name: 'NegotiatedPrice',
    item_count: 1,
    unit_price: amount,
    visit_id: visitId,
    booking_id: bookigId,
    user_id: orgConfig.orgConfig.DEFAULT_USER_ID,
  });

  // Modify advanced payment record with visit ID
  const modPayment = await dbStandard.modifySingleRecordDb(
    payments,
    { booking_id: bookigId },
    { visit_id: visitId }
  );

  return res.json(dbResult);
}

async function modifyCheckin(req, res, next) {
  const {
    checkinId,
    checkinDate,
    checkoutDate,
    roomId,
    bookigId,
    advancedAmount,
    guestIdArray,
    guestId,
    notes,
    isSettled,
    userId,
  } = req.body;

  const dbResult = await dbStandard.modifySingleRecordDb(
    visits,
    { id: checkinId },
    {
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      room_number: roomId,
      guest_id: guestId,
      additional_guests: guestIdArray,
      visit_notes: notes + '\nModified by: ' + userId,
      booking_id: bookigId,
      advanced_amount: advancedAmount,
      is_settled: isSettled,
    }
  );

  return res.json(dbResult);
}

async function listAllOngoingVisits(req, res, next) {
  const visitLists = await dbStandard.findAllFilterDb(visits, {
    is_settled: false,
  });

  const updatedItems = [];

  for (const item of visitLists) {
    const guest = await dbStandard.findOneFilterDb(guests, {
      id: item.guest_id,
    });

    const otherGuests = await dbStandard.findAllFilterDb(guests, {
      id: item.additional_guests,
    });

    const updatedItem = {
      ...item.get(),
      guest: guest,
      otherGuests: otherGuests,
    };

    updatedItems.push(updatedItem);
  }
  return res.json(updatedItems);
}

async function fetchVisitById(req, res, next) {
  const { visitId } = req.params;

  const visitDetails = await dbStandard.findOneFilterDb(visits, {
    id: visitId,
  });

  const guest = await dbStandard.findOneFilterDb(guests, {
    id: visitDetails?.guest_id,
  });

  const otherGuests = await dbStandard.findAllFilterDb(guests, {
    id: visitDetails?.additional_guests,
  });

  const purchases = await dbStandard.findAllFilterDb(visitorexpenses, {
    visit_id: visitId,
  });

  const booking = await dbStandard.findOneFilterDb(bookings, {
    id: visitDetails.booking_id,
  });

  const paymentRecords = await dbStandard.findAllFilterDb(payments, {
    visit_id: visitId,
    refund_date: null,
    amount: { [Op.gte]: 0 },
  });

  const adjustmentRecords = await dbStandard.findAllFilterDb(payments, {
    visit_id: visitId,
    refund_date: null,
    amount: { [Op.lt]: 0 },
  });

  const returnRecord = {
    ...visitDetails?.get({ plain: true }),
    guest,
    otherGuests,
    purchases,
    booking,
    paymentRecords,
    adjustmentRecords,
  };

  return res.json(returnRecord);
}

async function addPurchase(req, res, next) {
  const { purchases } = req.body;
  const dbResult = dbStandard.addMultipleRecorsdDB(visitorexpenses, purchases);
  return res.json(dbResult);
}

async function fetchVisitPurchaseByVisitId(req, res, next) {
  const { visitId } = req.params;

  const purchaseDetails = await dbStandard.findAllFilterDb(visitorexpenses, {
    visit_id: visitId,
  });

  return res.json(purchaseDetails);
}

async function checkout(req, res, next) {
  const { id, expense, payment, adjustment, checkoutDate, visitNotes } =
    req.body;

  console.log('req.body: ' + JSON.stringify(req.body));

  const dbResult = await dbStandard.modifySingleRecordDb(
    visits,
    { id: id },
    {
      checkout_date: checkoutDate,
      expense: expense,
      payment: payment,
      adjustment: adjustment,
      visit_notes: visitNotes,
      is_settled: true,
    }
  );

  return res.json(dbResult);
}

module.exports = {
  createCheckin,
  modifyCheckin,
  listAllOngoingVisits,
  fetchVisitById,
  addPurchase,
  fetchVisitPurchaseByVisitId,
  checkout,
};
