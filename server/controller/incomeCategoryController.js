const incomeService = require('../service/incomeCategoryService');

exports.getAll = async (req, res) => {
  const items = await incomeService.getAll();
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const item = await incomeService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const item = await incomeService.getById(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
};

exports.update = async (req, res) => {
  const item = await incomeService.update(req.params.id, req.body);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
};

exports.remove = async (req, res) => {
  const item = await incomeService.remove(req.params.id);
  item ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
};
