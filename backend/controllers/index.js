const router = require('express').Router();

router.use('/db-management', require('./db-controllers'));
router.use('/user-management', require('./user-controllers'));
router.use('/guest-management', require('./guest-controller'));
router.use('/booking-management', require('./booking-controller'));
router.use('/product-management', require('./product-controller'));
router.use('/visit-management', require('./visit-controller'));
router.use('/services', require('./standard-controllers'));
router.use('/payments', require('./payment-controller'));
router.use('/reports', require('./report-controller'));

module.exports = router;
