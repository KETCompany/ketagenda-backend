const express = require('express');
const controller = require('../controllers/group.controller');

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.put('/:id/post', controller.subscribe);

router.post('/', controller.create);

module.exports = router;
