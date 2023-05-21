const router = require('express').Router();
const reusableServices = require('../services/reusable-services');

//Send a single mail
router.post('/send-mail', reusableServices.sendSingleMail);

module.exports = router;
