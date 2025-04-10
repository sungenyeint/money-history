const IncomeCategory = require('../model/IncomeCategory');

exports.getAll = () => IncomeCategory.find();

exports.create = (data) => IncomeCategory.create(data);

exports.getById = (id) => IncomeCategory.findById(id);

exports.update = (id, data) => IncomeCategory.findByIdAndUpdate(id, data, { new: true });

exports.remove = (id) => IncomeCategory.findByIdAndDelete(id);
