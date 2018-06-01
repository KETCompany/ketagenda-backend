const express = require('express');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/', controller.update);

module.exports = router;
