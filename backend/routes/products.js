// routes/products.js
const express = require('express');
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

// GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
