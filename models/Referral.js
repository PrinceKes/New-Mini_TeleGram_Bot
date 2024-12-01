const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: { type: String, required: true },
  referredId: { type: String, required: true },
  referredUsername: { type: String, required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('Referral', referralSchema);
