const TransactionService = require('../service/TransactionService');

// Get all income records
exports.getAll = async (req, res) => {
  try {
    const items = await TransactionService.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new income record
exports.create = async (req, res) => {
  try {
    const item = await TransactionService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single income record by ID
exports.getById = async (req, res) => {
  try {
    const item = await TransactionService.getById(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an income record by ID
exports.update = async (req, res) => {
  try {
    const item = await TransactionService.update(req.params.id, req.body);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an income record by ID
exports.remove = async (req, res) => {
  try {
    const item = await TransactionService.remove(req.params.id);
    item ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
