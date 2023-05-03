const router = require('express').Router();
const productServices = require('../services/product-services');

// Fetch all product list
router.get('/fetch-packages', productServices.fetchAllPackages);
router.get('/fetch-rooms', productServices.fetchAllRooms);
router.get('/fetch-prixfixe', productServices.fetchAllPrixfixes);
router.get('/fetch-services', productServices.fetchAllServices);
router.get('/fetch-alacarte', productServices.fetchAllAlacarte);

// Add single package
router.post('/add-packages', productServices.addPackage);
router.post('/edit-packages', productServices.editPackage);

// Add single room
router.post('/add-room', productServices.addRoom);
router.post('/edit-room', productServices.editRoom);

// Add single prixfixe
router.post('/add-prixfixe', productServices.addPrixfixeItem);
router.post('/edit-prixfixe', productServices.editPrixfixeItem);

// Add single service
router.post('/add-service', productServices.addService);
router.post('/edit-service', productServices.editService);

// Add single room
router.post('/add-alacarte', productServices.addAlacarteItem);
router.post('/edit-alacarte', productServices.editAlacarteItem);

module.exports = router;
