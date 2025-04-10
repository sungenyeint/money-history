const Income = require('../model/Income');

// Get all income records
exports.getAll = () => Income.find().populate('incomeCategory');

// Create a new income record
exports.create = (data) => Income.create(data);

// Get a single income record by ID
exports.getById = (id) => Income.findById(id).populate('incomeCategory');

// Update an income record by ID
exports.update = (id, data) => Income.findByIdAndUpdate(id, data, { new: true }).populate('incomeCategory');

// Delete an income record by ID
exports.remove = (id) => Income.findByIdAndDelete(id);
