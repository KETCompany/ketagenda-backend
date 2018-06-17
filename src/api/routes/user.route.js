const express = require('express');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.get('/', controller.list);
router.get('/profile', controller.self);
router.get('/students', controller.listStudents);
router.get('/teachers', controller.listTeachers);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
