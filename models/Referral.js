const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: { type: String, required: true },
  referredId: { type: String, required: true },
  referredUsername: { type: String, required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('Referral', referralSchema);


// // Referral schema
// const referralSchema = new mongoose.Schema({
//   referrerId: String,
//   referredId: String,
//   referredUsername: String,
//   points: { type: Number, default: 250 },
// });

// const Referral = mongoose.model('Referral', referralSchema);

// // User schema
// const userSchema = new mongoose.Schema({
//   user_id: String,
//   username: String,
// });

// const User = mongoose.model('User', userSchema);