const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referral_id: { type: String, required: true, unique: true },
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

// Force the collection name to "Referrals"
const Referral = mongoose.model('Referral', referralSchema, 'Referrals'); 

module.exports = Referral;
