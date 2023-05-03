const router = require("express").Router();
const guestServices = require("../services/guest-services")

//List all guests
router.get("/", guestServices.listAllGuests);

//Add a single guest
router.post("/add-guest", guestServices.addNewGuest);

//Search guest based on whatever
router.get("/search-guest/:searchString", guestServices.searchGuests)

module.exports = router;
