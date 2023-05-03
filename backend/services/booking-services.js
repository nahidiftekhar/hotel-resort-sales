const dbStandard = require('./db-services/db-standard');
const dbBooking = require('./db-services/db-booking');
const {
  bookings,
  discounts,
  discountslabs,
  packages,
  prixfixeitems,
  alacarteitems,
  rooms,
  serviceitems,
  Sequelize,
} = require('../database/models');

async function fetchAllDiscountRequests(req, res, next) {
  const dbResult = await dbStandard.findAllFilterDb(discounts, {
    approval_status: 'pendingApproval',
  });
  return res.json(dbResult);
}

async function addNewBooking(req, res, next) {
  const {
    guestId,
    userId,
    checkInDate,
    checkOutDate,
    adultCount,
    kidsCount,
    amount,
    currency,
    components,
    notes,
  } = req.body;
  const dbResult = await dbStandard.addSingleRecordDB(bookings, {
    guest_id: guestId,
    user_id: userId,
    checkin_date: checkInDate,
    checkout_date: checkOutDate,
    amount: amount,
    discounted_amount: amount,
    adult_count: adultCount,
    kids_count: kidsCount,
    currency: currency ? currency : 'BDT',
    components: components,
    booking_status: 'negotiationPending',
    booking_notes: notes,
  });
  return res.json(dbResult);
}

async function checkDiscountLoa(userId) {
  const loaResult = await dbBooking.returnLoa(userId);
  return loaResult ? loaResult.discount_percentage : 0;
}

async function addDiscountEntry(req, res, next) {
  const {
    percentageValue,
    totalValue,
    notes,
    bookingId,
    requesterId,
    approverId,
  } = req.body;
  // const approverId = 1; //MD's ID as per business rule
  const totalDiscount = (totalValue * percentageValue) / 100;

  const highestDiscount = await dbStandard.findOneFilterDb(discountslabs, {
    user_type_id: 1,
  });
  const DiscountLoa = await checkDiscountLoa(requesterId);

  // 0: over MD's discount limit. 1: within MD's limit, over personal limit. 2: within personal discount limit
  const discountStatus =
    highestDiscount.discount_percentage < percentageValue
      ? 0
      : DiscountLoa >= percentageValue
      ? 2
      : 1;

  if (discountStatus === 0) return res.json(discountStatus);

  const addDiscount = await dbStandard.addSingleRecordDB(discounts, {
    booking_id: bookingId,
    requester_id: requesterId,
    approver_id: approverId,
    percentage_value: percentageValue,
    total_discount: totalDiscount,
    approval_status: discountStatus === 2 ? 'selfApproved' : 'pendingApproval',
    discount_notes: notes,
  });

  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      booking_status:
        discountStatus === 2 ? 'advancedPaymentPending' : 'approvalPending',
      discounted_amount: totalValue - totalDiscount,
    }
  );
  return res.json({ discountStatus, addDiscount, modifyBooking });
}

async function approveDiscount(req, res, next) {
  const {
    discountId,
    bookingId,
    approvedPercentage,
    notes,
    approverId,
    approvalStatus,
  } = req.body;

  const modifyDiscount = await dbStandard.modifySingleRecordDb(
    discounts,
    { id: discountId },
    {
      approver_id: approverId,
      percentage_value: approvedPercentage,
      approval_status: approvalStatus ? 'approverApproved' : 'approverRejected',
      discount_notes: notes,
    }
  );
  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      booking_status: approvalStatus
        ? 'advancedPaymentPending'
        : 'negotiationPending',
      discounted_amount: Sequelize.literal(`amount(1-${approvedPercentage})`),
    }
  );
  return res.json({ modifyDiscount, modifyBooking });
}

async function confirmAdvancedReceipt(req, res, next) {
  const { bookingId, advancedAmount, advancedNotes } = req.body;
  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      advanced_amount: advancedAmount,
      advanced_notes: advancedNotes,
      booking_status: 'bookingConfirmed',
    }
  );
  return res.json(modifyBooking);
}

async function cancelBooking(req, res, next) {
  const { bookingId, notes } = req.body;
  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      booking_status: 'canceled',
      booking_notes: Sequelize.fn(
        'CONCAT',
        Sequelize.col('notes'),
        '\n',
        notes
      ),
    }
  );
  return res.json(modifyBooking);
}

module.exports = {
  addNewBooking,
  addDiscountEntry,
  fetchAllDiscountRequests,
  approveDiscount,
  confirmAdvancedReceipt,
  cancelBooking,
};
