const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Task = require('./models/Task');
const User = require('./models/User');
const Referral = require('./models/Referral'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
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

// Routes

// Fetch user points (Updated or New Endpoint)
app.get('/api/user-points', async (req, res) => {
  const { user_id } = req.query; // User ID passed as a query parameter

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Query the database for the user's points
    const user = await User.findOne({ userId: user_id }); // Ensure `userId` matches your schema

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Respond with the user's balance or default it to 0 if not set
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
  const { user_id } = req.body; // Check for POST body
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    let user = await User.findOne({ user_id });
    if (!user) {
      user = new User({ user_id, balance: 0, completedTasks: [] });
      await user.save();
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
  const { taskId } = req.body;

  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    user.completedTasks.push(taskId);
    user.balance += task.reward;
    await user.save();

    res.status(200).json({ message: 'Task completed', balance: user.balance });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

