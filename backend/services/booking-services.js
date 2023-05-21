const dbStandard = require('./db-services/db-standard');
const dbBooking = require('./db-services/db-booking');
const {
  bookings,
  discounts,
  discountslabs,
  guests,
  packages,
  prixfixeitems,
  alacarteitems,
  rooms,
  serviceitems,
  usertypes,
} = require('../database/models');

const { Op, Sequelize } = require('sequelize');

async function fetchAllDiscountRequests(req, res, next) {
  const dbResult = await dbStandard.findAllFilterDb(discounts, {
    approval_status: 'pendingApproval',
  });
  return res.json(dbResult);
}

async function fetchMaxDiscountSlab(req, res, next) {
  const dbResult = await dbStandard.selectAllDb(discountslabs);
  const maxDiscountSlab = dbResult.reduce((max, item) => {
    return item.discount_percentage > max ? item.discount_percentage : max;
  }, 0);
  return res.json(maxDiscountSlab);
}

async function listAllBookingAfterToday(req, res, next) {
  const result = await dbStandard.joinTwoTablesFilterDb(
    bookings,
    guests,
    discounts,
    {
      [Op.or]: [{ checkin_date: { [Op.gte]: new Date() } }, { id: 4 }],
    }
  );
  return res.json(result);
}

async function fetchSingleBooking(req, res, next) {
  const { bookingId } = req.params;
  const singleBookingData = await dbStandard.findOneFilterDb(bookings, {
    id: bookingId,
  });

  const guestId = singleBookingData.guest_id;
  const guestData = await dbStandard.findOneFilterDb(guests, {
    id: guestId,
  });

  const discountData = await dbStandard.findOneFilterDb(discounts, {
    booking_id: bookingId,
  });

  return res.json({ bookingData: singleBookingData, guestData, discountData });
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
    discountedAmount,
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
  if (!modifyDiscount.success) return res.json({ modifyDiscount });

  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      booking_status: approvalStatus
        ? 'advancedPaymentPending'
        : 'negotiationPending',
      discounted_amount: discountedAmount,
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
  fetchSingleBooking,
  approveDiscount,
  confirmAdvancedReceipt,
  cancelBooking,
  fetchMaxDiscountSlab,
  listAllBookingAfterToday,
};
