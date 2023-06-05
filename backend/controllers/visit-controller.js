const router = require('express').Router();
const visitorServices = require('../services/visit-services');

//Create checkin
router.post('/create-checkin', visitorServices.createCheckin);

//Modify checkin
router.post('/edit-checkin', visitorServices.modifyCheckin);

//List all ongoing visits
router.get('/list-visits', visitorServices.listAllOngoingVisits);

//List single visit by ID
router.get('/view/:visitId', visitorServices.fetchVisitById);

//Create purchase
router.post('/add-purchase', visitorServices.addPurchase);

//List all purchases of a visit ID
router.get(
  '/view-purchases/:visitId',
  visitorServices.fetchVisitPurchaseByVisitId
);

//Checkout
router.post('/checkout', visitorServices.checkout);

module.exports = router;
