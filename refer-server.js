const express = require("express");
const bodyParser = require("body-parser");
const Referral = require("./refer-model");

const app = express();
app.use(bodyParser.json());

// Track referrals
app.post('/api/referrals/track', async (req, res) => {
    const { referrerId, referredId, referredUsername } = req.body;

    try {
        if (referrerId === referredId) {
            return res.status(400).json({ message: "You cannot refer yourself." });
        }

        // Check if referral exists
        const existingReferral = await Referral.findOne({ referrerId, referredId });
        if (existingReferral) {
            return res.status(400).json({ message: "Referral already exists." });
        }

        // Create a new referral
        const newReferral = new Referral({
            referrerId,
            referredId,
            referredUsername,
        });
        await newReferral.save();

        res.status(201).json({ message: "Referral tracked successfully." });
    } catch (err) {
        console.error("Error tracking referral:", err);
        res.status(500).json({ message: "Server error." });
    }
});

// Fetch all referrals
app.get('/api/referrals', async (req, res) => {
    try {
        const referrals = await Referral.find();
        res.status(200).json(referrals);
    } catch (err) {
        console.error("Error fetching referrals:", err);
        res.status(500).json({ message: "Server error." });
    }
});

// Fetch friends referred by a specific user
app.get('/api/referrals/friends/:referrerId', async (req, res) => {
    const { referrerId } = req.params;

    try {
        const referrals = await Referral.find({ referrerId });
        res.status(200).json(referrals);
    } catch (err) {
        console.error("Error fetching referred friends:", err);
        res.status(500).json({ message: "Server error." });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
