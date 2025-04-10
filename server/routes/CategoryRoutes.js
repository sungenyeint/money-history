const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/CategoryController');

router.get('/', CategoryController.getAll);
router.post('/', CategoryController.create);
router.get('/:id', CategoryController.getById);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.remove);

module.exports = router;
