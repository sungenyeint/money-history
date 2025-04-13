const Transaction = require('../model/Transaction');

// Get all transactions for a specific user and populate the category field
exports.getAll = async (userId) => {
  return await Transaction.find({ userId }).populate('category'); // Populate the category field
};

// Create a new transaction
exports.create = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

// Get a single transaction by ID for a specific user and populate the category field
exports.getById = async (id, userId) => {
  return await Transaction.findOne({ _id: id, userId }).populate('category'); // Populate the category field
};

// Update a transaction by ID for a specific user
exports.update = async (id, transactionData, userId) => {
  return await Transaction.findOneAndUpdate(
    { _id: id, userId }, // Query by _id and userId
    transactionData,
    { new: true } // Return the updated document
  ).populate('category'); // Populate the category field
};

// Delete a transaction by ID for a specific user
exports.remove = async (id, userId) => {
  return await Transaction.findOneAndDelete({ _id: id, userId }); // Query by _id and userId
};
