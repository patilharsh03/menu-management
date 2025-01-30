const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const mongoose = require('mongoose');

// Get single subcategory by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const subCategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subCategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create SubCategory
router.post('/', async (req, res) => {
  try {
    const subCategory = new SubCategory(req.body);
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all SubCategories
router.get('/', async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category');
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get SubCategories by Category
router.get('/category/:categoryId', async (req, res) => {
  try {

    if (mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format'})
    }
    const subCategories = await SubCategory.find({ 
      category: req.params.categoryId 
    }).populate('category');
    
    if (subCategories.length === 0) {
      return res.status(404).json({
        message: 'No subcategories found for this category'
      });
    }

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update SubCategory
router.put('/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
    res.json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;