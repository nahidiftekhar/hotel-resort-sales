const router = require("express").Router();
const dbServices = require("../services/db-services")

//Get table data
router.get("/credentials", dbServices.getAllUsers);

module.exports = router;
