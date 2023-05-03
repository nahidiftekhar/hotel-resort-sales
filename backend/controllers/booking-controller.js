const router = require('express').Router();
const bookingServices = require('../services/booking-services');

// Create new reservation/booking
router.post('/create-reservation', bookingServices.addNewBooking);

// Create a discount entry
router.post('/create-discount', bookingServices.addDiscountEntry);

// List all approval pending discount requests
router.post(
  '/list-discount-requests',
  bookingServices.fetchAllDiscountRequests
);

// Approve a discount request
router.post('/approve-discount', bookingServices.approveDiscount);

// Confirm advanced
router.post('/confirm-advanced', bookingServices.confirmAdvancedReceipt);

// Cancel Booking
router.post('/cancel-booking', bookingServices.cancelBooking);

module.exports = router;
