const Category = require('../model/Category');

exports.getAll = () => Category.find();

exports.create = (data) => Category.create(data);

exports.getById = (id) => Category.findById(id);

exports.update = (id, data) => Category.findByIdAndUpdate(id, data, { new: true });

exports.remove = (id) => Category.findByIdAndDelete(id);
