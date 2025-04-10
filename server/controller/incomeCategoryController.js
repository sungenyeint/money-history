const incomeCategoryService = require('../service/incomeCategoryService');

exports.getAll = async (req, res) => {
  const items = await incomeCategoryService.getAll();
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const item = await incomeCategoryService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await incomeCategoryService.getById(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await incomeCategoryService.update(req.params.id, req.body);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await incomeCategoryService.remove(req.params.id);
    item ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
