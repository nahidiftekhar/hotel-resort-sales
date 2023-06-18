const router = require('express').Router();
const roomServices = require('../services/room-services');

// List all room status for a month
router.get('/:dateString', roomServices.roomReservationStatusCurrentMonth);

// Get single room basic data
router.get('/room-data/:roomId', roomServices.singleRoomData);

module.exports = router;
