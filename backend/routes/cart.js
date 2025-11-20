// routes/cart.js
const express = require('express');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const router = express.Router();

/**
 * All routes here assume authentication middleware already ran
 * and set: req.user = { id, email }
 */

// GET /cart
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.user.id }).populate('productId');
    const total = items.reduce((acc, it) => acc + (it.productId.price * it.quantity), 0);
    res.json({ items, total });
  } catch (err) {
    console.error('GET /cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /cart  -> body: { productId, quantity }
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let item = await CartItem.findOne({ userId: req.user.id, productId });
    if (item) {
      item.quantity = item.quantity + Number(quantity);
      if (item.quantity < 1) item.quantity = 1;
      await item.save();
    } else {
      item = await CartItem.create({ userId: req.user.id, productId, quantity });
    }
    const populated = await CartItem.findById(item._id).populate('productId');
    res.json(populated);
  } catch (err) {
    console.error('POST /cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /cart/:id  -> update quantity { quantity }
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (String(item.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    item.quantity = Number(quantity) || item.quantity;
    if (item.quantity < 1) item.quantity = 1;
    await item.save();
    const populated = await CartItem.findById(item._id).populate('productId');
    res.json(populated);
  } catch (err) {
    console.error('PUT /cart/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /cart/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (String(item.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    await item.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /cart/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
