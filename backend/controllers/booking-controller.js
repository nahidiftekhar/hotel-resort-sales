const router = require('express').Router();
const bookingServices = require('../services/booking-services');

// Create new reservation/booking
router.post('/create-booking', bookingServices.addNewBooking);

//Get a single booking record by id
router.get(
  '/get-booking-record/:bookingId',
  bookingServices.fetchSingleBooking
);

// List max discount
router.get('/max-discount', bookingServices.fetchMaxDiscountSlab);

// List all bookings with date more than today
router.get('/list-all-booking', bookingServices.listAllBookingAfterToday);

// Create a discount entry
router.post('/create-discount', bookingServices.addDiscountEntry);

// List all approval pending discount requests
router.get('/list-discount-requests', bookingServices.fetchAllDiscountRequests);

// Approve a discount request
router.post('/approve-discount', bookingServices.approveDiscount);

// Confirm advanced
router.post('/confirm-advanced', bookingServices.confirmAdvancedReceipt);

// Cancel Booking
router.post('/cancel-booking', bookingServices.cancelBooking);

module.exports = router;
