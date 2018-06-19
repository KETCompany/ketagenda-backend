const express = require('express');
const controller = require('../controllers/group.controller');

const router = express.Router();

router.get('/', controller.list);

router.post('/subscribe', controller.subscribe);
router.delete('/subscribe', controller.unSubscribe);

router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);


router.post('/', controller.create);

module.exports = router;
