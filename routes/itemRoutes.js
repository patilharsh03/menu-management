const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create Item
router.post('/', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category')
      .populate('subCategory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Items by name
router.get('/search', async (req, res) => {
  try {
    const items = await Item.find({
      name: { $regex: req.query.name, $options: 'i' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Item
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;