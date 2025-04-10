const express = require('express');
const router = express.Router();
const incomeController = require('../controller/incomeController');

router.get('/', incomeController.getAll);
router.post('/', incomeController.create);
router.get('/:id', incomeController.getById);
router.put('/:id', incomeController.update);
router.delete('/:id', incomeController.remove);

module.exports = router;
