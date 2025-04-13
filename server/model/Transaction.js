const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Store Firebase uid as a string
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema, 'transactions');
