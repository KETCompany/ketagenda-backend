const express = require('express');
const controller = require('../controllers/room.controller');

const router = express.Router();

router.post('/reservation', controller.post);

router.get('/', controller.list);

router.get('/infoscreen', controller.getByInfoScreen);

router.get('/:id', controller.get);

router.get('/:id/bookings', controller.list);

module.exports = router;
