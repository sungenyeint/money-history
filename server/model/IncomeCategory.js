const mongoose = require('mongoose');

const incomeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IncomeCategory', incomeCategorySchema, 'incomeCategories');
