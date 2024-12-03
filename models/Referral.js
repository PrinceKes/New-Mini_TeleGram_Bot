const mongoose = require('mongoose');

// Define Referral Schema
const referralSchema = new mongoose.Schema({
  referral_id: Number,
  referred_Users: [{
    user_id: Number,
    username: String,
    reward: Number,
  }],
});

const Referral = mongoose.model('Referral', referralSchema);



// referral_id: 98754334
// referred_Users[
//   user_1: @Username
//   user_id: 22765438
//   reward: 250 Rst Point,

//   user_2: @Username
//   user_id: 76435438
//   reward: 250 Rst Point
// ]