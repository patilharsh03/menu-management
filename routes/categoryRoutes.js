const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');

// Create Category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Category by ID or name
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let category;
    
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      category = await Category.findById(identifier);
    } else {
      category = await Category.findOne({ name: identifier});
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found'});
    }

    res.json(category);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
});

// Update Category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;