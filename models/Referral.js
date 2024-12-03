const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referral_id: { type: String, required: true, unique: true },
  referred_Users: [{
    user_id: String,
    username: String,
    reward: Number,
  }],
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
