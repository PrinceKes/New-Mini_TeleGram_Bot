const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referral_id: { type: String, required: true, unique: true }, // Custom referral ID
  username: { type: String, required: true },
  referrals: [
    {
      referredUserId: { type: String, required: true },
      referredUsername: { type: String, required: true },
      reward: { type: Number, required: true },
      isClaimed: { type: Boolean, default: false },
    },
  ],
});

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;
