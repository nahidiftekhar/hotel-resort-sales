const router = require('express').Router();
const dbServices = require('../services/test-services');

// Get table data
router.get('/', dbServices.testDb);

router.get('/credentials', dbServices.getAllUsers);

// Add to servicecategories
router.get('/add-service-categories', dbServices.addServiceCategories);

module.exports = router;
