// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const authMiddleware = require('./middleware/auth'); // explicit object

const app = express();

app.use(cors({
  origin: ['https://your-netlify-site.netlify.app', 'http://localhost:5173'], 
  credentials: true,
}));
app.use(express.json());

// debug types (remove later)
console.log('type authRoutes ->', typeof authRoutes);
console.log('type productRoutes ->', typeof productRoutes);
console.log('type cartRoutes ->', typeof cartRoutes);
console.log('type authMiddleware.authenticate ->', typeof authMiddleware.authenticate);

// Register routes (only pass functions to app.use)
if (typeof authRoutes === 'function' || (typeof authRoutes === 'object' && authRoutes?.stack)) {
  app.use('/auth', authRoutes);
} else {
  throw new Error('authRoutes is not a valid router');
}

if (typeof productRoutes === 'function' || (typeof productRoutes === 'object' && productRoutes?.stack)) {
  app.use('/products', productRoutes);
} else {
  throw new Error('productRoutes is not a valid router');
}

// protect cart with middleware if available and a function
if (authMiddleware && typeof authMiddleware.authenticate === 'function') {
  app.use('/cart', authMiddleware.authenticate, cartRoutes);
} else {
  throw new Error('Auth middleware not found or not a function. Check middleware/auth.js export.');
}

// simple health
app.get('/', (req, res) => res.json({ ok: true, time: new Date() }));

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_ecom';

async function start() {
  try {
    await mongoose.connect(MONGO);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

start();
