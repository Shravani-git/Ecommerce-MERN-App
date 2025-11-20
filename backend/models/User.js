const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

// optional: fast lookup on email
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
