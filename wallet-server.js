const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/telegram_wallet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    _id: String,
    walletAddress: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/wallet/:userId', async (req, res) => {
    const { userId } = req.params;
    const { walletAddress } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { walletAddress },
            { new: true, upsert: true }
        );
        res.json({ message: 'Wallet address saved successfully!' });
    } catch (error) {
        console.error('Error saving wallet address:', error);
        res.status(500).json({ error: 'Failed to save wallet address' });
    }
});

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

