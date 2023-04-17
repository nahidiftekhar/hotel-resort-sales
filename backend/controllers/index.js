const router = require('express').Router();

router.use('/db-management', require('./db-controllers'))
router.use('/user-management', require('./user-controllers'))

module.exports = router;