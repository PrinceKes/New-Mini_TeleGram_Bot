const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Task = require('./models/Task');
const User = require('./models/User');
const Referral = require('./models/Referral');

const router = express.Router();

const app = express();
const PORT = process.env.PORT;


// Middleware
app.use(express.json());
app.use("/api", router);
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://new-mini-telegram-bot.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('Error: MONGO_URI is not set in environment variables.');
  process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Fetch user points (Updated or New Endpoint)
app.get('/api/user-points', async (req, res) => {
  const { user_id } = req.query; 

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ points: user.balance || 0 });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Routes
// Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description, reward, category, link } = req.body;
  try {
    const newTask = new Task({ title, description, reward, category, link });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


// Update task completion and user balance

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = await User.findOne({ user_id }); // Changed from userId
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.completedTasks.includes(id)) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    user.completedTasks.push(id);
    user.balance += task.reward;
    await user.save();

    res.status(200).json({ message: 'Task marked as completed', balance: user.balance });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});







// Register or fetch a user
app.post('/api/users/register', async (req, res) => {
  const { user_id, username } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    let user = await User.findOne({ user_id });
    if (!user) {
      user = new User({
        user_id,
        username: username || null,
        balance: 0,
        completedTasks: [],
      });
      await user.save();
    } else {
      if (username && user.username !== username) {
        user.username = username;
        await user.save();
      }
    }
    res.status(200).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});









// Get user by ID
app.get('/api/users/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id }).populate('completedTasks');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user balance by user_id
app.post('/api/users/balance', async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});


// Update user balance
app.put('/api/users/:user_id/balance', async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.balance += amount;
    await user.save();
    res.status(200).json({ message: 'Balance updated', balance: user.balance });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ error: 'Failed to update balance' });
  }
});











// Complete a specific task for a user
app.put('/api/users/:user_id/complete-task', async (req, res) => {
  console.log('PUT request received at /api/users/:user_id/complete-task');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  const { taskId } = req.body;
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    user.completedTasks.push(taskId);
    user.balance += task.reward;
    await user.save();

    res.status(200).json({ message: 'Task completed successfully', balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/tasks/:task_id', async (req, res) => {
  const { userId } = req.body;
  const { task_id } = req.params;

  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (user.completedTasks.includes(task_id)) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    user.completedTasks.push(task_id);
    user.balance += task.reward;
    await user.save();

    res.status(200).json({ message: 'Task completed successfully', newBalance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});











// Endpoint to handle referral link usage
app.post('/api/referrals', async (req, res) => {
  const { referrerId, referredId, referredUsername } = req.body;

  if (!referrerId || !referredId || !referredUsername) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    // Check if the referral already exists
    const existingReferral = await Referral.findOne({ referrerId, referredId });
    if (existingReferral) {
      return res.status(200).json({ message: 'Referral already exists' });
    }

    // Save the referral
    const referral = new Referral({ referrerId, referredId, referredUsername });
    await referral.save();

    res.status(201).json({ message: 'Referral recorded successfully' });
  } catch (error) {
    console.error('Error saving referral:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Endpoint to fetch referrals for a specific user
app.get('/api/referrals/:referrerId', async (req, res) => {
  const { referrerId } = req.params;

  if (!referrerId) {
    return res.status(400).json({ message: 'Referrer ID is required' });
  }

  try {
    const referrals = await Referral.find({ referrerId });
    if (!referrals.length) {
      return res.status(200).json({ message: 'No referrals found.', referrals: [] });
    }

    // Map referrals into the required format
    const referralData = referrals.map((ref) => ({
      referredId: ref.referredId,
      referredUsername: ref.referredUsername,
      points: ref.points,
    }));

    res.status(200).json({ referrals: referralData });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Endpoint to claim points
app.post('/api/referrals/claim', async (req, res) => {
  const { referrerId, referredId } = req.body;

  if (!referrerId || !referredId) {
    return res.status(400).json({ message: 'Referrer ID and Referred ID are required' });
  }

  try {
    const referral = await Referral.findOne({ referrerId, referredId });
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    // Add points to referrer's balance
    const user = await User.findOne({ user_id: referrerId });
    if (!user) {
      return res.status(404).json({ message: 'Referrer not found' });
    }

    user.balance += referral.points;
    await user.save();

    // Mark referral as claimed or delete it
    await Referral.deleteOne({ _id: referral._id });

    res.status(200).json({ message: 'Points claimed successfully', newBalance: user.balance });
  } catch (error) {
    console.error('Error claiming points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// All other codes are above

// Define your API routes
router.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


router.get('/api/referrals/:userId', (req, res) => {
  const userId = req.params.userId;
  res.json({ referralLink: `https://t.me/SunEarner_bot?start=${userId}` });
});

router.get('/api/referrals/friends/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch referred friends from the database
    const referrals = await Referral.find({ referrerId: userId }).select('referredId referredUsername');
    if (referrals.length === 0) {
      return res.status(200).json({ friends: [] });
    }

    res.status(200).json({ friends: referrals });
  } catch (error) {
    console.error('Error fetching referred friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.use("/", router);







// CODE BY FARAZ

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { user_id: 1, username: 1, balance: 1, _id: 0 });

    const sortedUsers = users.sort((a, b) => b.balance - a.balance);

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});





// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
