const router = require('express').Router();
const productServices = require('../services/product-services');

// Fetch all product list
router.get('/fetch-packages', productServices.fetchAllPackages);
router.get('/fetch-rooms', productServices.fetchAllRooms);
router.get('/fetch-prixfixe', productServices.fetchAllPrixfixes);
router.get('/fetch-services', productServices.fetchAllServices);
router.get('/fetch-alacarte', productServices.fetchAllAlacarte);

// Add single package
router.post('/add-package', productServices.addPackage);
router.post('/edit-package', productServices.editPackage);
router.post('/activate-package', productServices.activatePackage);
router.post('/deactivate-package', productServices.deactivatePackage);
router.get('/package-categories', productServices.fetchPackagesTypes);

// Room
router.post('/add-room', productServices.addRoom);
router.post('/edit-room', productServices.editRoom);
router.post('/deactivate-room', productServices.deactivateRoom);
router.get('/room-categories', productServices.fetchRoomTypes);
router.get('/room-list', productServices.fetchRooms);

// Venue
router.post('/add-venue', productServices.addVenue);
router.post('/edit-venue', productServices.editVenue);
router.post('/deactivate-venue', productServices.deactivateVenue);
router.get('/venue-list', productServices.fetchVenues);

// Room type
router.get('/room-categories', productServices.fetchRoomTypes);
router.post('/edit-room-type', productServices.editRoomType);
router.post('/add-room-type', productServices.addRoomType);
router.post('/deactivate-room-type', productServices.deactivateRoomType);

// Add single prixfixe
router.post('/add-prixfixe', productServices.addPrixfixeItem);
router.post('/edit-prixfixe', productServices.editPrixfixeItem);
router.get('/prixfixe-categories', productServices.fetchPrixfixeTypes);
router.post('/deactivate-prixfixe', productServices.deactivatePrixfixe);

// Add single service
router.post('/add-service', productServices.addService);
router.post('/edit-service', productServices.editService);
router.get('/service-categories', productServices.fetchServiceTypes);
router.post('/deactivate-service', productServices.deactivateService);

// Alacarte
router.post('/add-alacarte', productServices.addAlacarteItem);
router.post('/edit-alacarte', productServices.editAlacarteItem);
router.get('/alacarte-categories', productServices.fetchAlacarteTypes);
router.post('/deactivate-alacarte', productServices.deactivateAlacarte);

module.exports = router;
