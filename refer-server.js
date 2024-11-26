const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const mongoURI = "mongodb+srv://dbUser:dbUserpass@telegrambot.yngj8.mongodb.net/?retryWrites=true&w=majority";
let db;

MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db("telegramMiniApp");
    console.log("Connected to MongoDB");

});

app.get('/referral-link/:userId', async (req, res) => {
    const { userId } = req.params;
    const referralLink = `https://t.me/SunEarner_bot?start=${userId}`;
    res.json({ referralLink });
});

app.post('/track-referral', async (req, res) => {
    const { referrerId, referredId } = req.body;

    try {
        // Ensure the referred user is not the same as the referrer
        if (referrerId === referredId) {
            return res.status(400).json({ message: "You cannot refer yourself." });
        }

        // Check if the referral already exists
        const existingReferral = await Referral.findOne({ referrerId, referredId });
        if (existingReferral) {
            return res.status(400).json({ message: "Referral already exists." });
        }

        // Add referral to the database
        const newReferral = new Referral({
            referrerId,
            referredId,
            points: 250, // Initial reward points
        });
        await newReferral.save();

        // Update referrer's points (if applicable)
        // Assuming you have a `User` model with points
        const referrer = await User.findById(referrerId);
        if (referrer) {
            referrer.points += 250; // Reward points
            await referrer.save();
        }

        res.status(201).json({ message: "Referral tracked successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});











// // Endpoint to fetch referrals for a user
// app.get("/get-referrals", async (req, res) => {
//     const { user_id } = req.query;

//     try {
//         const referrals = await db.collection("referrals").find({ referrerId: user_id }).toArray();
//         res.status(200).json(referrals);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to fetch referrals");
//     }
// });

// // Endpoint to log referrals when a referral link is used
// app.post("/log-referral", async (req, res) => {
//     const { referrerId, referredId, referredUsername } = req.body;

//     try {
//         await db.collection("referrals").insertOne({
//             referrerId,
//             referredId,
//             referredUsername,
//             rewardClaimed: false
//         });
//         res.status(200).send("Referral logged successfully");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to log referral");
//     }
// });

// // Endpoint to claim referral rewards
// app.post("/claim-reward", async (req, res) => {
//     const { referralId } = req.body;

//     try {
//         // Find referral entry
//         const referral = await db.collection("referrals").findOne({ _id: new ObjectId(referralId) });

//         if (!referral || referral.rewardClaimed) {
//             return res.status(400).send("Invalid referral or reward already claimed");
//         }

//         // Update user's balance
//         await db.collection("users").updateOne(
//             { userId: referral.referrerId },
//             { $inc: { balance: 2500 } }
//         );

//         // Mark reward as claimed
//         await db.collection("referrals").updateOne(
//             { _id: new ObjectId(referralId) },
//             { $set: { rewardClaimed: true } }
//         );

//         res.status(200).send("Reward claimed successfully");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to claim reward");
//     }
// });

// app.listen(4000, () => console.log("Referral server running on port 4000"));
