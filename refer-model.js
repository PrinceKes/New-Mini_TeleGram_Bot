const mongoose = require('mongoose');

// Define the Referral Schema
const referralSchema = new mongoose.Schema({
    referrerId: { type: String, required: true }, // Telegram user ID of the referrer
    referredId: { type: String, required: true }, // Telegram user ID of the referred user
    referredUsername: { type: String, required: true }, // Telegram username of the referred user
    rewardClaimed: { type: Boolean, default: false }, // Whether the reward has been claimed
    referralDate: { type: Date, default: Date.now }, // Date of the referral
});

// Create the Referral model
const Referral = mongoose.model('Referral', referralSchema);

// Function to connect to MongoDB and initialize the database
const connectToDatabase = async () => {
    try {
        const mongoURI = "mongodb://127.0.0.1:27017/telegramBotDB"; // Replace with your MongoDB URI
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully!");

        await Referral.init();
        console.log("Referral collection initialized!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

connectToDatabase();

module.exports = Referral;
