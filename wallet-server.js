const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/telegram_wallet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define User schema and model
const userSchema = new mongoose.Schema({
    _id: String, // Use Telegram user ID as _id
    walletAddress: String,
});

const User = mongoose.model('User', userSchema);

// Routes
// Store wallet address
app.post('/api/wallet/:userId', async (req, res) => {
    const { userId } = req.params;
    const { walletAddress } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { walletAddress },
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );
        res.json({ message: 'Wallet address saved successfully!' });
    } catch (error) {
        console.error('Error saving wallet address:', error);
        res.status(500).json({ error: 'Failed to save wallet address' });
    }
});

// Get wallet address
app.get('/api/wallet/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user || !user.walletAddress) {
            return res.status(404).json({ walletAddress: null });
        }
        res.json({ walletAddress: user.walletAddress });
    } catch (error) {
        console.error('Error fetching wallet address:', error);
        res.status(500).json({ error: 'Failed to fetch wallet address' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// const cors = require('cors');
// app.use(cors());


// // Initialize Express app
// const app = express();

// // Middleware
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/telegram_wallet', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Define User schema and model
// const userSchema = new mongoose.Schema({
//     _id: String, // Use Telegram user ID as _id
//     walletAddress: String,
// });

// const User = mongoose.model('User', userSchema);

// // Routes
// // Store wallet address
// app.post('/api/wallet/:userId', async (req, res) => {
//     const { userId } = req.params;
//     const { walletAddress } = req.body;

//     try {
//         const user = await User.findByIdAndUpdate(
//             userId,
//             { walletAddress },
//             { new: true, upsert: true } // Create a new document if it doesn't exist
//         );
//         res.json({ message: 'Wallet address saved successfully!' });
//     } catch (error) {
//         console.error('Error saving wallet address:', error);
//         res.status(500).json({ error: 'Failed to save wallet address' });
//     }
// });

// // Get wallet address
// app.get('/api/wallet/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const user = await User.findById(userId);
//         if (!user || !user.walletAddress) {
//             return res.status(404).json({ walletAddress: null });
//         }
//         res.json({ walletAddress: user.walletAddress });
//     } catch (error) {
//         console.error('Error fetching wallet address:', error);
//         res.status(500).json({ error: 'Failed to fetch wallet address' });
//     }
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

