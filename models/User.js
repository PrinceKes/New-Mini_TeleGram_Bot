const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  actions: [String],
  lastActiveAt: Date,
});

module.exports = mongoose.model('User', userSchema);
