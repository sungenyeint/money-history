const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    incomeCategory: {type: mongoose.Schema.Types.ObjectId, ref: "IncomeCategory"},
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', incomeSchema, 'incomes');
