const express = require('express');
const controller = require('../controllers/group.controller');

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', controller.get);

router.post('/', controller.create);

module.exports = router;
