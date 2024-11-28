const express = require("express");
const bodyParser = require("body-parser");
const Referral = require("./refer-model"); // Import the Referral model

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




// const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");
// const bodyParser = require("body-parser");
// const Referral = require('./refer-model'); 

// const app = express();
// app.use(bodyParser.json());

// // MongoDB connection
// const mongoURI = "mongodb+srv://dbUser:dbUserpass@telegrambot.yngj8.mongodb.net/?retryWrites=true&w=majority";
// let db;

// MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
//     if (err) throw err;
//     db = client.db("telegramMiniApp");
//     console.log("Connected to MongoDB");
// });

// // Endpoint to get referral link
// app.get('/api/referrals/:userId', async (req, res) => {
//     const { userId } = req.params;
//     const referralLink = `https://t.me/SunEarner_bot?start=${userId}`;
//     res.json({ referralLink });
// });

// // Endpoint to track referrals
// app.post('/api/referrals', async (req, res) => {
//     const { referrerId, referredId } = req.body;

//     try {
//         if (referrerId === referredId) {
//             return res.status(400).json({ message: "You cannot refer yourself." });
//         }

//         const existingReferral = await db.collection('referrals').findOne({ referrerId, referredId });
//         if (existingReferral) {
//             return res.status(400).json({ message: "Referral already exists." });
//         }

//         await db.collection('referrals').insertOne({
//             referrerId,
//             referredId,
//             points: 250,
//             date: new Date()
//         });

//         res.status(201).json({ message: "Referral tracked successfully." });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error." });
//     }
// });

// // Endpoint to fetch referred friends
// app.get('/api/referrals/friends/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const referrals = await db.collection('referrals').find({ referrerId: userId }).toArray();
//         res.json({ friends: referrals });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to fetch referred friends." });
//     }
// });


// app.get('/api/referrals/friends', async (req, res) => {
//     try {
//         // Retrieve all referrals from the database
//         const referrals = await Referral.find();
//         res.status(200).json(referrals);
//     } catch (err) {
//         console.error("Error fetching referrals:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

