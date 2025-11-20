require('dotenv').config();
const mongoose = require('mongoose');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_ecom';

(async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connect error:', err.message);
    process.exit(1);
  }
})();
