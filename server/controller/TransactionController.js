const TransactionService = require('../service/TransactionService');

// Get all transactions for the authenticated user
exports.getAll = async (req, res) => {
  try {
    const userId = req.user.uid; // Extract userId from the authenticated user
    const items = await TransactionService.getAll(userId); // Pass userId to the service
    const sortedItems = items.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
    res.json(sortedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new transaction for the authenticated user
exports.create = async (req, res) => {
  try {
    const userId = req.user.uid; // Extract userId from the authenticated user
    const transactionData = { ...req.body, userId }; // Add userId to the transaction data
    const item = await TransactionService.create(transactionData);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single transaction by ID for the authenticated user
exports.getById = async (req, res) => {
  try {
    const userId = req.user.uid; // Extract userId from the authenticated user
    const item = await TransactionService.getById(req.params.id, userId); // Pass userId to the service
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a transaction by ID for the authenticated user
exports.update = async (req, res) => {
  try {
    const userId = req.user.uid; // Extract userId from the authenticated user
    const transactionData = { ...req.body, userId }; // Ensure userId is included
    const item = await TransactionService.update(req.params.id, transactionData, userId); // Pass userId to the service
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a transaction by ID for the authenticated user
exports.remove = async (req, res) => {
  try {
    const userId = req.user.uid; // Extract userId from the authenticated user
    const item = await TransactionService.remove(req.params.id, userId); // Pass userId to the service
    item ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
