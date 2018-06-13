const express = require('express');
const controller = require('../controllers/room.controller');

const router = express.Router();

router.get('/', controller.list);

router.post('/', controller.post);

router.get('/infoscreen', controller.getByInfoScreen);

router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.get('/:id/bookings', controller.list);

module.exports = router;
