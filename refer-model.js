const mongoose = require('mongoose');

// Define the Referral Schema
const referralSchema = new mongoose.Schema({
    referrerId: { type: String, required: true },
    referredId: { type: String, required: true },
    referredUsername: { type: String, required: true },
    rewardClaimed: { type: Boolean, default: false },
    referralDate: { type: Date, default: Date.now },
});

// Create the Referral model
const Referral = mongoose.model('Referral', referralSchema);

// Function to connect to MongoDB and initialize the database
const connectToDatabase = async () => {
    try {
        const mongoURI = "mongodb://127.0.0.1:27017/telegramBotDB";
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
