const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Task = require('./models/Task');
const User = require('./models/User');
const Referral = require('./models/Referral');
// const User = require("./models/User");

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
  const { user_id } = req.body;
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


// Route: GET /api/referrals script
app.get("/api/referrals", async (req, res) => {
  try {
    const referrals = await Referral.find(); // Fetch all referrals
    res.json(referrals);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
});

// Route: POST /api/referrals
app.post("/api/referrals", async (req, res) => {
  const { referrerId, referredId, points } = req.body;

  try {
    // Save new referral record
    const newReferral = new Referral({ referrerId, referredId, points });
    await newReferral.save();

    res.status(201).json({ message: "Referral created successfully", newReferral });
  } catch (error) {
    console.error("Error creating referral:", error);
    res.status(500).json({ error: "Failed to create referral" });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect("mongodb+srv://<username>:<password>@cluster.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));




// here are the scripts for referring:

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



// All other codes are above

// Define your API routes
router.get('/api/user', (req, res) => {
  const userId = "12345"; // Replace with actual logic to fetch user ID from DB
  res.json({ userId });
});

router.get('/api/referrals/:userId', (req, res) => {
  const userId = req.params.userId;
  // Replace this with your logic to fetch referral link
  res.json({ referralLink: `https://t.me/SunEarner_bot?start=${userId}` });
});

router.get('/api/referrals/friends/:userId', (req, res) => {
  const userId = req.params.userId;
  // Replace this with your logic to fetch referred friends
  res.json({ friends: [{ referredId: "Friend1" }, { referredId: "Friend2" }] });
});

app.use("/", router);




// // Endpoint to get the referral link
// router.get('/api/referrals/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//       const referralLink = `https://t.me/SunEarner_bot?start=${userId}`;
//       res.json({ referralLink });
//   } catch (error) {
//       console.error("Error fetching referral link:", error);
//       res.status(500).json({ message: "Failed to generate referral link" });
//   }
// });


// // Endpoint to get all user IDs
// router.get("/api/user", async (req, res) => {
//     try {
//         const users = await User.find({}, "user_id"); // Fetch all user IDs
//         res.json({ users });
//     } catch (error) {
//         console.error("Error fetching user IDs:", error);
//         res.status(500).json({ message: "Failed to fetch user IDs" });
//     }
// });



// // Example of route where you render the friends page
// router.get('/friends', (req, res) => {
//   const userId = req.user.id;
//   res.render('friends', { userId });
// });


// module.exports = router;




// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const Task = require('./models/Task');
// const User = require('./models/User');
// const Referral = require('./models/Referral'); 

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors({
//   origin: 'https://new-mini-telegram-bot.onrender.com',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

// // MongoDB connection
// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) {
//   console.error('Error: MONGO_URI is not set in environment variables.');
//   process.exit(1);
// }

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Successfully connected to MongoDB'))
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB:', error);
//     process.exit(1);
//   });

// // Routes

// // Fetch user points
// app.get('/api/user-points', async (req, res) => {
//   const { user_id } = req.query; 

//   if (!user_id) {
//     return res.status(400).json({ message: 'User ID is required.' });
//   }

//   try {
//     const user = await User.findOne({ user_id });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     res.json({ points: user.balance || 0 });
//   } catch (error) {
//     console.error('Error fetching user points:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });

// // Fetch all tasks
// app.get('/api/tasks', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.status(200).json(tasks);
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ error: 'Failed to fetch tasks' });
//   }
// });

// // Create a new task
// app.post('/api/tasks', async (req, res) => {
//   const { title, description, reward, category, link } = req.body;
//   try {
//     const newTask = new Task({ title, description, reward, category, link });
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: 'Failed to create task' });
//   }
// });

// // Delete a task by ID
// app.delete('/api/tasks/:id', async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) return res.status(404).json({ error: 'Task not found' });
//     res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     res.status(500).json({ error: 'Failed to delete task' });
//   }
// });

// // Mark a task as completed and update the user's balance
// app.put('/api/tasks/:id/claim', async (req, res) => {
//   const { user_id } = req.body;
//   const { id: taskId } = req.params;

//   try {
//     // Find task
//     const task = await Task.findById(taskId);
//     if (!task) return res.status(404).json({ error: 'Task not found' });

//     // Find user
//     const user = await User.findOne({ user_id });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Check if task already completed
//     if (user.completedTasks.includes(taskId)) {
//       return res.status(400).json({ error: 'Task already completed' });
//     }

//     // Mark task as completed and update balance
//     user.completedTasks.push(taskId);
//     user.balance += task.reward;
//     await user.save();

//     res.status(200).json({
//       message: 'Task successfully completed and reward claimed',
//       balance: user.balance,
//     });
//   } catch (error) {
//     console.error('Error completing task:', error);
//     res.status(500).json({ error: 'Failed to complete task' });
//   }
// });

// // Register or fetch a user
// app.post('/api/users/register', async (req, res) => {
//   const { user_id } = req.body;
//   if (!user_id) return res.status(400).json({ error: 'user_id is required' });

//   try {
//     let user = await User.findOne({ user_id });
//     if (!user) {
//       user = new User({ user_id, balance: 0, completedTasks: [] });
//       await user.save();
//     }
//     res.status(200).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Failed to register user' });
//   }
// });

// // Get user by ID
// app.get('/api/users/:user_id', async (req, res) => {
//   try {
//     const user = await User.findOne({ user_id: req.params.user_id }).populate('completedTasks');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.status(200).json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// });



// app.put('/api/users/:user_id/complete-task', async (req, res) => {
//   const { taskId } = req.body; // Task ID from the request body
//   const { user_id } = req.params; // User ID from URL parameters

//   try {
//     const user = await User.findOne({ user_id });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const task = await Task.findById(taskId);
//     if (!task) return res.status(404).json({ error: 'Task not found' });

//     if (user.completedTasks.includes(taskId)) {
//       return res.status(400).json({ error: 'Task already completed' });
//     }

//     // Add task ID to completed tasks and update balance
//     user.completedTasks.push(taskId);
//     user.balance += task.reward;
//     await user.save();

//     res.status(200).json({ message: 'Task completed successfully', balance: user.balance });
//   } catch (error) {
//     console.error('Error completing task:', error);
//     res.status(500).json({ error: 'Failed to complete task' });
//   }
// });




// // Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

