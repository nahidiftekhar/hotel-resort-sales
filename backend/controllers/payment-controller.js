const router = require('express').Router();
const paymentServices = require('../services/payment-services');

//List all payments
router.get('/', paymentServices.listAllPayment);

//Add purchase payment
router.post('/purchase-payment', paymentServices.addPurchasePayment);

module.exports = router;
