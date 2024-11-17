const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const Task = require('./models/Task');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

const uri = "mongodb+srv://dbUser:dbUserpass@telegrambot.yngj8.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas:', error);
  });

app.listen(PORT, () => {
  // console.log(Server running on port ${PORT});
});

// Route to fetch tasks from the MongoDB collection
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Route to create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description, reward, category, link } = req.body; // Add link here

  try {
    const newTask = new Task({ title, description, reward, category, link }); // Include link
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Route to delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id); // Delete the task using Mongoose
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Route to complete a task and award points
app.post('/api/tasks/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const task = await Task.findById(id);  
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const reward = task.reward;

    // Assuming you have a 'users' collection and logic to update user points
    // Here, we assume the user is found and points are updated accordingly

    task.isCompleted = true; 
    await task.save();

    res.json({ message: 'Task completed and points awarded', points: reward });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Route to update a task as completed
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});




// Route to update user balance
app.put('/api/users/:userId/balance', async (req, res) => {
  const { userId } = req.params;
  const { reward } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += reward;
    await user.save();

    res.json({ message: 'Balance updated', balance: user.balance });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ error: 'Failed to update balance' });
  }
});








// route to update Users activities
// const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);



// handle users ID storage

app.post('/api/users', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ user_id });
    if (!user) {
      // Create a new user if not found
      user = new User({ user_id });
      await user.save();
    }

    res.json({ message: 'User ID saved successfully', user });
  } catch (error) {
    console.error('Error saving user ID:', error);
    res.status(500).json({ error: 'Failed to save user ID' });
  }
});


// Tracking User Activities in MongoDB

app.put('/api/users/:userId/track', async (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { user_id: userId },
      { $set: { lastActiveAt: new Date() }, $push: { actions: action } },
      { new: true, upsert: true }
    );

    res.json({ message: 'User activity tracked', user });
  } catch (error) {
    console.error('Error tracking user activity:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
});
