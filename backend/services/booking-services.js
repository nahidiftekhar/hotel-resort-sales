const dbStandard = require('./db-services/db-standard');
const dbBooking = require('./db-services/db-booking');
const {
  bookings,
  discounts,
  discountslabs,
  guests,
  payments,
  credentials,
  usertypes,
  roomreservations,
  venuereservations,
} = require('../database/models');
const helper = require('../services/utils/helper');

const { Op, Sequelize } = require('sequelize');
const { sendSingleEmail } = require('./utils/send-email');
const getRoomBookingModifications =
  require('./utils/room-booking-modifications').getRoomBookingModifications;
const getVenueBookingModifications =
  require('./utils/venue-booking-modifications').getVenueBookingModifications;

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
      [Op.or]: [{ checkout_date: { [Op.gte]: new Date() } }],
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

  // check if any room is already booked by other booking id
  if (components.roomDetails) {
    for (const singleVenue of components?.roomDetails) {
      const bookedRoom = await dbStandard.findAllFilterDb(roomreservations, {
        room_id: singleVenue.roomId,
        reservation_date: {
          [Op.between]: [singleVenue.checkInDate, singleVenue.checkOutDate],
        },
        status: {
          [Op.not]: '',
        },
      });
      console.log('bookedRoom: ' + JSON.stringify(bookedRoom));
      if (bookedRoom.length) {
        return res.json({
          success: false,
          message: 'Conflict found with room: ' + singleVenue.room_number,
        });
      }
    }
  }

  // check if any venue is already booked by other booking id
  if (components.venueDetails) {
    for (const singleVenue of components?.venueDetails) {
      const bookedVenue = await dbStandard.findAllFilterDb(venuereservations, {
        venue_id: singleVenue.venueId,
        reservation_date: {
          [Op.between]: [singleVenue.checkInDate, singleVenue.checkOutDate],
        },
        status: {
          [Op.not]: '',
        },
      });
      console.log('bookedVenue: ' + JSON.stringify(bookedVenue));
      if (bookedVenue.length) {
        return res.json({
          success: false,
          message: 'Conflict found with venue: ' + singleVenue.venue_name,
        });
      }
    }
  }
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

  if (components.roomDetails) {
    components.roomDetails.map(async (singleRoom) => {
      const currentDate = new Date(singleRoom.checkInDate);
      const lastDate = new Date(singleRoom.checkOutDate);
      while (currentDate <= lastDate) {
        await manageRoomBooking({
          roomId: singleRoom.roomId,
          reservationDate: currentDate,
          status: 'booked',
          notes: 'User: ' + user_id + '\nGuest: ' + guest_id,
          bookingId: dbBooking.dbResult.id,
          visitId: null,
          userId: user_id,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }

  if (components.venueDetails) {
    components.venueDetails.map(async (singleVenue) => {
      const currentDate = new Date(singleVenue.checkInDate);
      const lastDate = new Date(singleVenue.checkOutDate);
      while (currentDate <= lastDate) {
        await manageVenueBooking({
          venueId: singleVenue.venueId,
          reservationDate: currentDate,
          status: 'booked',
          notes: 'User: ' + user_id + '\nGuest: ' + guest_id,
          bookingId: dbBooking.dbResult.id,
          visitId: null,
          userId: user_id,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }

  return res.json({ dbBooking, dbDiscount });
}

async function editBooking(req, res, next) {
  const {
    id,
    guest_id,
    user_id,
    checkin_date,
    checkout_date,
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

  const existingRecord = await dbStandard.findOneFilterDb(bookings, { id });

  // All these for rooms
  if (components?.roomDetails) {
    // check if any room is already booked by other booking id
    for (const singleVenue of components?.roomDetails) {
      const bookedRoom = await dbStandard.findAllFilterDb(roomreservations, {
        room_id: singleVenue.roomId,
        booking_id: {
          [Op.not]: id,
        },
        reservation_date: {
          [Op.between]: [singleVenue.checkInDate, singleVenue.checkOutDate],
        },
        status: {
          [Op.not]: '',
        },
      });
      console.log('bookedRoom: ' + JSON.stringify(bookedRoom));
      if (bookedRoom.length) {
        return res.json({
          success: false,
          message: 'Conflict found with room: ' + singleVenue.room_number,
        });
      }
    }

    const roomModifications = getRoomBookingModifications(
      existingRecord.components.roomDetails,
      components.roomDetails
    );

    for (const roomModification of roomModifications.removedDatesBookings) {
      await manageRoomBooking({
        roomId: roomModification.roomId,
        reservationDate: roomModification.removedDate,
        status: '',
        notes: 'Released by user: ' + user_id,
        bookingId: id,
        visitId: null,
        userId: user_id,
      });
    }

    for (const roomModification of roomModifications.addedDatesBookings) {
      await manageRoomBooking({
        roomId: roomModification.roomId,
        reservationDate: roomModification.addedDate,
        status: 'booked',
        notes: 'User: ' + user_id + '\nGuest: ' + guest_id,
        bookingId: id,
        visitId: null,
        userId: user_id,
      });
    }
  }

  // All these for venues
  if (components?.venueDetails) {
    // check if any venue is already booked by other booking id
    for (const singleVenue of components?.venueDetails) {
      const bookedVenue = await dbStandard.findAllFilterDb(venuereservations, {
        venue_id: singleVenue.venueId,
        booking_id: {
          [Op.not]: id,
        },
        reservation_date: {
          [Op.between]: [singleVenue.checkInDate, singleVenue.checkOutDate],
        },
        status: {
          [Op.not]: '',
        },
      });
      console.log('bookedVenue: ' + JSON.stringify(bookedVenue));
      if (bookedVenue.length) {
        return res.json({
          success: false,
          message: 'Conflict found with venue: ' + singleVenue.venue_name,
        });
      }
    }

    const venueModifications = getVenueBookingModifications(
      existingRecord.components.venueDetails,
      components.venueDetails
    );

    for (const venueModification of venueModifications.removedDatesBookings) {
      await manageVenueBooking({
        venueId: venueModification.venueId,
        reservationDate: venueModification.removedDate,
        status: '',
        notes: 'Released by user: ' + user_id,
        bookingId: id,
        visitId: null,
        userId: user_id,
      });
    }

    for (const venueModification of venueModifications.addedDatesBookings) {
      await manageVenueBooking({
        venueId: venueModification.venueId,
        reservationDate: venueModification.addedDate,
        status: 'booked',
        notes: 'User: ' + user_id + '\nGuest: ' + guest_id,
        bookingId: id,
        visitId: null,
        userId: user_id,
      });
    }
  }

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
      user_id: user_id,
      guest_id: guest_id,
      checkin_date: checkin_date,
      checkout_date: checkout_date,
      amount: amount,
      discounted_amount: discounted_amount,
      currency: currency ? currency : 'BDT',
      components: components,
      price_components: price_components,
      // booking_status: booking_status,
      booking_status:
        discountStatus === 2
          ? 'advancedPaymentPending'
          : 'discountApprovalPending',
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
          discount_notes: '\nUser Id: ' + user_id + '\n' + discount_notes,
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

  // if (components.roomDetails) {
  //   components.roomDetails.map(async (singleRoom) => {
  //     const currentDate = new Date(singleRoom.checkin_date);
  //     const lastDate = new Date(singleRoom.checkout_date);
  //     while (currentDate <= lastDate) {
  //       await manageRoomBooking({
  //         roomId: singleRoom.roomId,
  //         reservationDate: currentDate,
  //         status: 'booked',
  //         notes: 'User: ' + user_id + '\nGuest: ' + guest_id,
  //         bookingId: id,
  //         visitId: null,
  //         userId: user_id,
  //       });
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }
  //   });
  // }

  // if (components.venueDetails) {
  //   components.venueDetails.map(async (singleVenue) => {
  //     const currentDate = new Date(singleVenue.checkin_date);
  //     const lastDate = new Date(singleVenue.checkout_date);
  //     while (currentDate <= lastDate) {
  //       await manageVenueBooking({
  //         venueId: singleVenue.venueId,
  //         reservationDate: currentDate,
  //         status: 'booked',
  //         notes: 'User: ' + user_id + '\nGuest: ' + guest_id,
  //         bookingId: id,
  //         visitId: null,
  //         userId: user_id,
  //       });
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }
  //   });
  // }

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
      booking_status: 'cancelled',
      booking_notes: notes,
    }
  );
  return res.json(modifyBooking);
}

async function eidtRoomBooking(req, res, next) {
  const {
    roomId,
    checkInDate,
    checkOutDate,
    status,
    userId,
    bookingId,
    visitId,
    guestId,
    notes,
  } = req.body;

  console.log('req.body: ' + JSON.stringify(req.body));

  const currentDate = new Date(checkInDate);
  const lastDate = new Date(checkOutDate);

  try {
    while (currentDate <= lastDate) {
      await manageRoomBooking({
        roomId: roomId,
        reservationDate: currentDate,
        status: status,
        notes: notes + '\n\nUser: ' + userId + '\nGuest: ' + guestId,
        bookingId: bookingId,
        visitId: visitId,
        userId: userId,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return res.json({ success: true });
  } catch (error) {
    console.log('Error in room booking: ' + error);
    return res.json({ success: false });
  }
}

async function manageRoomBooking({
  roomId,
  reservationDate,
  status,
  notes,
  bookingId,
  visitId,
  userId,
}) {
  console.log(
    '\n\n\nroomId: ' + roomId + ' reservationDate: ' + reservationDate
  );
  const roomsStatusUpdate = await dbStandard.addOrUpdateSingleDb(
    roomreservations,
    {
      room_id: roomId,
      reservation_date: reservationDate,
    },
    {
      booking_id: bookingId,
      visit_id: visitId,
      user_id: userId,
      status: status,
      notes: notes,
    }
  );

  return roomsStatusUpdate;
}

async function manageVenueBooking({
  venueId,
  reservationDate,
  status,
  notes,
  bookingId,
  visitId,
  userId,
}) {
  const venueStatusUpdate = await dbStandard.addOrUpdateSingleDb(
    venuereservations,
    {
      venue_id: venueId,
      reservation_date: reservationDate,
    },
    {
      booking_id: bookingId,
      visit_id: visitId,
      user_id: userId,
      status: status,
      notes: notes,
    }
  );

  return venueStatusUpdate;
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
  eidtRoomBooking,
  manageRoomBooking,
  manageVenueBooking,
};
