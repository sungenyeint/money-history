const mongoose = require('mongoose');

const incomeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String }
});

module.exports = mongoose.model('IncomeCategory', incomeCategorySchema, 'incomeCategories');
