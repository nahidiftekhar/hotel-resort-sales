const router = require('express').Router();
const reportServices = require('../services/report-services');

// Cancel Booking
router.get('/', reportServices.listAllPayment);

module.exports = router;
