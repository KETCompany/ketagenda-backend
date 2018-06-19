const express = require('express');
const controller = require('../controllers/profile.controller');

const router = express.Router();

router.get('/', controller.self);
router.put('/', controller.update);

module.exports = router;
