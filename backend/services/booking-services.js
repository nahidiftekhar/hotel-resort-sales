const dbStandard = require('./db-services/db-standard');
const dbBooking = require('./db-services/db-booking');
const {
  bookings,
  discounts,
  discountslabs,
  guests,
  payments,
  credentials,
  packages,
  prixfixeitems,
  alacarteitems,
  rooms,
  serviceitems,
  usertypes,
} = require('../database/models');
const helper = require('../services/utils/helper');

const { Op, Sequelize } = require('sequelize');
const { sendSingleEmail } = require('./utils/send-email');

async function fetchAllDiscountRequests(req, res, next) {
  const dbResult = await dbStandard.findAllFilterDb(discounts, {
    approval_status: 'pendingApproval',
  });
  return res.json(dbResult);
}

async function fetchDiscountRequestsById(req, res, next) {
  const dbResult = await dbStandard.joinFilterDb(discounts, bookings, {
    approval_status: 'pendingApproval',
    approver_id: req.params.approverId,
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
      [Op.or]: [{ checkin_date: { [Op.gte]: new Date() } }],
      // [Op.or]: [{ checkin_date: { [Op.gte]: new Date() } }, { id: 4 }],
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

async function addBooking(req, res, next) {
  const {
    guest_id,
    user_id,
    checkInDate,
    checkOutDate,
    amount,
    discounted_amount,
    currency,
    components,
    price_components,
    booking_notes,
    requester_id,
    approver_id,
    discount_notes,
  } = req.body;

  const highestDiscount = await dbStandard.findOneFilterDb(discountslabs, {
    user_type_id: 1,
  });
  const DiscountLoa = await checkDiscountLoa(requester_id);

  // 0: over MD's discount limit. 1: within MD's limit, over personal limit. 2: within personal discount limit
  const discountStatus =
    highestDiscount.discount_percentage <
    ((amount - discounted_amount) * 100) / amount
      ? 0
      : DiscountLoa >= ((amount - discounted_amount) * 100) / amount
      ? 2
      : 1;

  if (discountStatus === 0) return res.json(discountStatus);

  const uniqueRef = await helper.generateReference(0);

  const dbBooking = await dbStandard.addSingleRecordDB(bookings, {
    user_id: user_id,
    guest_id: guest_id,
    checkin_date: checkInDate,
    checkout_date: checkOutDate,
    amount: amount,
    discounted_amount: discounted_amount,
    currency: currency ? currency : 'BDT',
    components: components,
    price_components: price_components,
    booking_status:
      discountStatus === 2
        ? 'advancedPaymentPending'
        : 'discountApprovalPending',
    booking_notes: booking_notes,
    advanced_notes: new Date() + 'Booking created',
    booking_ref: uniqueRef,
  });

  const dbDiscount = dbBooking.success
    ? await dbStandard.addSingleRecordDB(discounts, {
        booking_id: dbBooking.dbResult.id,
        requester_id: requester_id,
        approver_id: approver_id,
        percentage_value: ((amount - discounted_amount) * 100) / amount,
        rack_price: amount,
        total_discount: amount - discounted_amount,
        approval_status:
          discountStatus === 2 ? 'selfApproved' : 'pendingApproval',
        discount_notes: discount_notes,
        price_components: price_components,
      })
    : { success: false };

  if (dbDiscount.success && discountStatus === 1) {
    const mailSubject = 'System generated email: Discount approval request';
    const mailBody =
      'You have received a request for discount approval. Please log in to booking management system for necessary action.';
    const approverDetail = await dbStandard.joinFilterDb(
      usertypes,
      credentials,
      {
        id: 1,
      }
    );
    if (approverDetail.length) {
      approverDetail.map((approver) =>
        sendSingleEmail(approver.credentials[0].email, mailBody, mailSubject)
      );
    }
  }

  return res.json({ dbBooking, dbDiscount });
}

async function editBooking(req, res, next) {
  const {
    id,
    guestId,
    userId,
    checkInDate,
    checkOutDate,
    amount,
    discounted_amount,
    currency,
    components,
    price_components,
    booking_notes,
    booking_status,
    requester_id,
    discount_id,
    approver_id,
    discount_notes,
  } = req.body;

  const highestDiscount = await dbStandard.findOneFilterDb(discountslabs, {
    user_type_id: 1,
  });
  const DiscountLoa = await checkDiscountLoa(requester_id);

  // 0: over MD's discount limit. 1: within MD's limit, over personal limit. 2: within personal discount limit
  const discountStatus =
    highestDiscount.discount_percentage <
    ((amount - discounted_amount) * 100) / amount
      ? 0
      : DiscountLoa >= ((amount - discounted_amount) * 100) / amount
      ? 2
      : 1;

  if (discountStatus === 0) return res.json(discountStatus);

  const dbBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    {
      id: id,
    },
    {
      user_id: userId,
      guest_id: guestId,
      checkin_date: checkInDate,
      checkout_date: checkOutDate,
      amount: amount,
      discounted_amount: discounted_amount,
      currency: currency ? currency : 'BDT',
      components: components,
      price_components: price_components,
      booking_status: booking_status,
      booking_notes: booking_notes,
    }
  );

  const dbDiscount = dbBooking.success
    ? await dbStandard.modifySingleRecordDb(
        discounts,
        {
          id: discount_id,
        },
        {
          booking_id: id,
          requester_id: requester_id,
          approver_id: approver_id,
          percentage_value: ((amount - discounted_amount) * 100) / amount,
          rack_price: amount,
          total_discount: amount - discounted_amount,
          approval_status:
            discountStatus === 2 ? 'selfApproved' : 'pendingApproval',
          discount_notes: discount_notes,
          price_components: price_components,
        }
      )
    : { success: false };

  if (dbDiscount.success && discountStatus === 1) {
    const mailSubject = 'System generated email: Discount approval request';
    const mailBody =
      'You have received a request for discount approval. Please log in to booking management system for necessary action.';
    const approverDetail = await dbStandard.joinFilterDb(
      usertypes,
      credentials,
      {
        id: 1,
      }
    );
    if (approverDetail.length) {
      approverDetail.map((approver) =>
        sendSingleEmail(approver.credentials[0].email, mailBody, mailSubject)
      );
    }
  }

  return res.json({ dbBooking, dbDiscount });
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
    approvedDiscount,
    notes,
    approverNotes,
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
      total_discount: approvedDiscount,
      approval_status: approvalStatus ? 'approverApproved' : 'approverRejected',
      discount_notes: notes,
      approval_notes: approverNotes,
    }
  );
  if (!modifyDiscount.success) return res.json({ modifyDiscount });

  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      booking_status: approvalStatus
        ? 'advancedPaymentPending'
        : 'discountRejected',
      discounted_amount: discountedAmount,
    }
  );
  return res.json({ modifyDiscount, modifyBooking });
}

async function confirmAdvancedReceipt(req, res, next) {
  const {
    bookingId,
    advancedAmount,
    previousAdvanced,
    advancedNotes,
    paymentNotes,
    paymentOption,
    guestId,
    // visitId,
  } = req.body;

  const addPayment = await dbStandard.addSingleRecordDB(payments, {
    amount: advancedAmount,
    payment_method: paymentOption,
    payment_notes: paymentNotes,
    guest_id: guestId,
    // visit_id: visitId,
    booking_id: bookingId,
    payment_receiver: 'Advanced',
  });

  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      advanced_amount: Number(advancedAmount) + Number(previousAdvanced),
      advanced_notes: advancedNotes,
      booking_status: 'bookingConfirmed',
    }
  );

  if (modifyBooking.success && addPayment.success)
    return res.json({ success: true, addPayment, modifyBooking });
  else return res.json({ success: false, addPayment, modifyBooking });
}

async function cancelBooking(req, res, next) {
  const { bookingId, notes } = req.body;
  const modifyBooking = await dbStandard.modifySingleRecordDb(
    bookings,
    { id: bookingId },
    {
      booking_status: 'canceled',
      booking_notes: notes,
    }
  );
  return res.json(modifyBooking);
}

module.exports = {
  addNewBooking,
  editBooking,
  addBooking,
  addDiscountEntry,
  fetchAllDiscountRequests,
  fetchDiscountRequestsById,
  fetchSingleBooking,
  approveDiscount,
  confirmAdvancedReceipt,
  cancelBooking,
  fetchMaxDiscountSlab,
  listAllBookingAfterToday,
};
