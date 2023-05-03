const router = require('express').Router();

router.use('/db-management', require('./db-controllers'));
router.use('/user-management', require('./user-controllers'));
router.use('/guest-management', require('./guest-controller'));
router.use('/booking-management', require('./booking-controller'));
router.use('/product-management', require('./product-controller'));

module.exports = router;
