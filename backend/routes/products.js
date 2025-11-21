// backend/routes/products.js
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

/**
 * GET /products
 * supports: ?search=&category=&page=&limit=
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(Number(limit));
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /products/categories
 * returns distinct categories (must be above the '/:id' route)
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (err) {
    console.error('GET /products/categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /products/:id
 * defensive: validate id first to avoid CastError
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // defensive check: if id is not a valid ObjectId, return 400
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const p = await Product.findById(id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
