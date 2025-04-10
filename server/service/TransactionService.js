const Transaction = require('../model/Transaction');

// Get all Transaction records
exports.getAll = () => Transaction.find().populate('category');

// Create a new Transaction record
exports.create = (data) => Transaction.create(data);

// Get a single Transaction record by ID
exports.getById = (id) => Transaction.findById(id).populate('category');

// Update an Transaction record by ID
exports.update = (id, data) => Transaction.findByIdAndUpdate(id, data, { new: true }).populate('category');

// Delete an Transaction record by ID
exports.remove = (id) => Transaction.findByIdAndDelete(id);
