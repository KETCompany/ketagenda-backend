const express = require('express');
const controller = require('../controllers/event.controller');

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', controller.get);

router.post('/', controller.create);

router.get('/:id/bookings', controller.list);

module.exports = router;
