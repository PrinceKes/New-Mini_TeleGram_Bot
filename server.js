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
  console.log('Received data:', { user_id, username });

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    let user = await User.findOne({ user_id });
    console.log('Found user:', user);
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












// referral handles 
// here are the script that handle Create a new profile for the first-time user

// Middleware to create a user profile if not exists
app.use(async (req, res, next) => {
  const { userId, username } = req.query; // Extract userId and username from the request

  // Allow requests to the '/api/referrals' endpoint with only userId
  if (req.path === '/api/referrals' && userId) {
    return next();
  }

  if (!userId || !username) {
    return res.status(400).json({ message: 'Missing userId or username' });
  }

  try {
    // Check if the user already exists
    const existingUser = await Referral.findOne({ referral_id: userId });

    if (!existingUser) {
      // Create a new profile for the first-time user
      const newUserProfile = new Referral({
        referral_id: userId,
        username,
        referrals: [],
      });

      await newUserProfile.save();
      console.log(`Created profile for new user: ${username}`);
    }

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Error checking or creating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





//This script set up referral and referred profiles for all users
app.post('/api/referrals', async (req, res) => {
  const { referrer_id, user_id, username } = req.body;

  if (!referrer_id || !user_id || !username) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await Referral.findOne({ referral_id: user_id });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const referrerProfile = await Referral.findOne({ referral_id: referrer_id });
    if (!referrerProfile) {
      return res.status(404).json({ message: 'Referrer not found' });
    }

    // Create a new profile for the referred user
    const newUserProfile = new Referral({
      referral_id: user_id,
      username,
      referrals: [],
    });

    await newUserProfile.save();

    referrerProfile.referrals.push({
      referredUserId: user_id,
      referredUsername: username,
      reward: 250,
    });

    await referrerProfile.save();

    res.status(201).json({
      message: 'Referred user added and reward assigned to referrer',
      referredUser: newUserProfile,
      referrer: referrerProfile,
    });
  } catch (error) {
    console.error('Error handling referral:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






app.get('/api/referrals', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query' });
  }

  try {
    // Query by referral_id
    const user = await Referral.findOne({ referral_id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ referred_Users: user.referrals });
  } catch (error) {
    console.error('Error fetching referral data:', error);
    res.status(500).json({ message: 'Error fetching referral data', error });
  }
});

















app.put('/api/referrals/:referral_id/claim', async (req, res) => {
  const { referral_id } = req.params;
  const { userId } = req.body; // Retrieve userId from the request body

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId or username' });
  }

  try {
    // Find the referral record
    const referral = await Referral.findById(referral_id);
    if (!referral) return res.status(404).json({ error: 'Referral not found' });

    // Check if the reward has already been claimed
    if (referral.isClaimed) {
      return res.status(400).json({ error: 'Reward already claimed' });
    }

    // Find the referrer user
    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update the user's balance and mark the referral as claimed
    user.balance += referral.reward;
    referral.isClaimed = true;

    await user.save();
    await referral.save();

    res.status(200).json({
      message: 'Reward claimed successfully',
      newBalance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});












// // New endpoint to fetch all referred users for a specific userId
// app.get('/api/referrals/users', async (req, res) => {
//   const { userId } = req.query;

//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required' });
//   }

//   try {
//     // Find the user by their referral_id
//     const user = await Referral.findOne({ referral_id: userId });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Return the referred users
//     res.json({ referred_Users: user.referred_Users });
//   } catch (error) {
//     console.error('Error fetching referral data:', error);
//     res.status(500).json({ message: 'Error fetching referral data' });
//   }
// });










app.use("/api", router);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { user_id: 1, username: 1, balance: 1, _id: 0 });
    const sortedUsers = users.sort((a, b) => b.balance - a.balance);
    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// CODE BY FARAZ

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users and include their balance (roast value)
    const users = await User.find({}, { user_id: 1, username: 1, balance: 1, _id: 0 });

    // Sort users by balance in descending order for leaderboard
    const sortedUsers = users.sort((a, b) => b.balance - a.balance);

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
