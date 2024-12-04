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





// const mongoose = require('mongoose');

// const referralSchema = new mongoose.Schema({
//   referral_id: { type: String, required: true, unique: true },
//   referred_Users: [
//     {
//       user_id: { type: String, required: true },
//       username: { type: String, required: true },
//       reward: { type: Number, required: true },
//     },
//   ],
// }, { collection: 'referral' }); // Specify collection name explicitly

// const Referral = mongoose.model('Referral', referralSchema);
// module.exports = Referral;
