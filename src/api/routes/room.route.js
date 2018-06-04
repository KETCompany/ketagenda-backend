const express = require('express');
const controller = require('../controllers/room.controller');

const router = express.Router();

router.get('/', controller.list);


router.get('/infoscreen/:key', controller.getByInfoScreen);

router.post('/reservation', controller.post);

router.get('/:id', controller.get);

router.get('/:id/bookings', controller.list);

module.exports = router;
