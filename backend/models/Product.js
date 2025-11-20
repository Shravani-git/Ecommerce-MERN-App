const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], default: [] },
  category: { type: String, default: 'general', index: true },
  stock: { type: Number, default: 100, min: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

// small virtual for formatted price if needed
productSchema.virtual('priceText').get(function() {
  return `₹${this.price}`;
});

module.exports = mongoose.model('Product', productSchema);
