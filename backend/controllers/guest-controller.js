const router = require('express').Router();
const guestServices = require('../services/guest-services');

// List all guests
router.get('/list-all', guestServices.listAllGuests);

// Add a single guest
router.post('/add-guest', guestServices.addNewGuest);

// Edit a single guest data
router.post('/edit-guest', guestServices.editGuest);

// Search guest based on whatever
router.get('/search-guest/:searchString', guestServices.searchGuests);

// Fetch guest based on ID
router.get('/fetch-guest/:guestId', guestServices.fetchSingleGuestById);

module.exports = router;
