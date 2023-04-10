const router = require('express').Router();

router.use('/user-management', require('./user-routes'))
router.use('/db-management', require('./db-routes'))

module.exports = router;