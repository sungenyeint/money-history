const express = require('express');
const router = express.Router();
const TransactionController = require('../controller/TransactionController');

router.get('/', TransactionController.getAll);
router.post('/', TransactionController.create);
router.get('/:id', TransactionController.getById);
router.put('/:id', TransactionController.update);
router.delete('/:id', TransactionController.remove);

module.exports = router;
