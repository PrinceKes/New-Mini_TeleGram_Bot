const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const Task = require('./models/Task');
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

// MongoDB connection using environment variable
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

// Fetch tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
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
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});












app.get('/api/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findOne({ user_id }).populate('completedTasks');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


app.put('/api/users/:user_id/balance', async (req, res) => {
  const { user_id } = req.params;
  const { amount } = req.body;

  try {
    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.balance += amount;
    await user.save();
    res.json({ message: 'Balance updated', balance: user.balance });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ error: 'Failed to update balance' });
  }
});


app.put('/api/users/:user_id/complete-task', async (req, res) => {
  const { user_id } = req.params;
  const { taskId } = req.body;

  try {
    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    user.completedTasks.push(taskId);
    user.balance += task.reward; // Update balance with task reward
    await user.save();

    res.json({ message: 'Task completed', balance: user.balance });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});


















// // Log a referral
// app.post('/log-referral', async (req, res) => {
//   const { referrerId, referredId, referredUsername } = req.body;
//   try {
//     const newReferral = new Referral({
//       referrerId,
//       referredId,
//       referredUsername,
//     });
//     await newReferral.save();
//     res.status(200).send('Referral logged successfully');
//   } catch (error) {
//     console.error('Error logging referral:', error);
//     res.status(500).json({ error: 'Failed to log referral' });
//   }
// });

// // Claim referral reward
// app.post('/claim-reward', async (req, res) => {
//   const { referralId } = req.body;
//   try {
//     const referral = await Referral.findById(referralId);

//     if (!referral || referral.rewardClaimed) {
//       return res.status(400).send('Invalid referral or reward already claimed');
//     }

//     // Update user balance
//     // Assuming you have a User model
//     const User = mongoose.model('User');
//     await User.updateOne(
//       { userId: referral.referrerId },
//       { $inc: { balance: 2500 } }
//     );

//     // Mark reward as claimed
//     referral.rewardClaimed = true;
//     await referral.save();

//     res.status(200).send('Reward claimed successfully');
//   } catch (error) {
//     console.error('Error claiming reward:', error);
//     res.status(500).send('Failed to claim reward');
//   }
// });

// // Save or Update User
// app.post('/api/users', async (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   try {
//     const user = await User.findOneAndUpdate(
//       { user_id },
//       { lastActiveAt: new Date() }, // Update lastActiveAt when user starts the bot
//       { new: true, upsert: true } // Create if doesn't exist
//     );

//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.status(500).json({ error: 'Failed to save user' });
//   }
// });


// // Fetch All Users
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find(); // Fetch all users
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });


// // Log Referral
// app.post('/api/log-referral', async (req, res) => {
//   const { referrerId, referredId } = req.body;

//   if (!referrerId || !referredId) {
//     return res.status(400).json({ error: 'Both referrer and referred IDs are required' });
//   }

//   try {
//     const newReferral = new Referral({
//       referrerId,
//       referredId,
//       points: 1050, // Add default points for referral
//     });

//     await newReferral.save();

//     // Add points to the referrer’s balance
//     const referrer = await User.findOneAndUpdate(
//       { user_id: referrerId },
//       { $inc: { balance: 1050 } },
//       { new: true }
//     );

//     res.status(200).json({ message: 'Referral logged successfully', referrer });
//   } catch (error) {
//     console.error('Error logging referral:', error);
//     res.status(500).json({ error: 'Failed to log referral' });
//   }
// });


// // Fetch All Referrals
// app.get('/api/referrals', async (req, res) => {
//   try {
//     const referrals = await Referral.find(); // Fetch all referrals
//     res.status(200).json(referrals);
//   } catch (error) {
//     console.error('Error fetching referrals:', error);
//     res.status(500).json({ error: 'Failed to fetch referrals' });
//   }
// });


// // Save or Update User with Balance
// app.post('/api/users', async (req, res) => {
//   const { user_id, balance } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   try {
//     const user = await User.findOneAndUpdate(
//       { user_id },
//       { $set: { balance }, lastActiveAt: new Date() }, // Update balance and lastActiveAt
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.status(500).json({ error: 'Failed to save user' });
//   }
// });



// // Start the server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));












































// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); 
// const Task = require('./models/Task');
// const { MongoClient, ObjectId } = require('mongodb');
// // const { MongoClient, ObjectId } = require("mongodb");
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(express.json());

// app.use(cors({
//   // origin: 'http://localhost:8000',
//   origin: 'https://new-mini-telegram-bot.onrender.com',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true 
// }));

// const uri = "mongodb+srv://dbUser:dbUserpass@telegrambot.yngj8.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Successfully connected to MongoDB Atlas');
//   })
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB Atlas:', error);
//   });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Route to fetch tasks from the MongoDB collection
// app.get('/api/tasks', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.json({ tasks });
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ error: 'Failed to fetch tasks' });
//   }
// });

// // Route to create a new task
// app.post('/api/tasks', async (req, res) => {
//   const { title, description, reward, category, link } = req.body; // Add link here

//   try {
//     const newTask = new Task({ title, description, reward, category, link }); // Include link
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: 'Failed to create task' });
//   }
// });

// // Route to delete a task by ID
// app.delete('/api/tasks/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const task = await Task.findByIdAndDelete(id); // Delete the task using Mongoose
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     res.json({ message: 'Task deleted' });
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     res.status(500).json({ error: 'Failed to delete task' });
//   }
// });

// // Route to complete a task and award points
// app.post('/api/tasks/:id/complete', async (req, res) => {
//   const { id } = req.params;
//   const { user_id } = req.body;

//   try {
//     const task = await Task.findById(id);  
//     if (!task) return res.status(404).json({ message: 'Task not found' });

//     const reward = task.reward;

//     // Assuming you have a 'users' collection and logic to update user points
//     // Here, we assume the user is found and points are updated accordingly

//     task.isCompleted = true; 
//     await task.save();

//     res.json({ message: 'Task completed and points awarded', points: reward });
//   } catch (error) {
//     console.error('Error completing task:', error);
//     res.status(500).json({ error: 'Failed to complete task' });
//   }
// });

// // Route to update a task as completed
// app.put('/api/tasks/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const task = await Task.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
//     if (!task) return res.status(404).json({ message: 'Task not found' });
//     res.json(task);
//   } catch (error) {
//     console.error('Error completing task:', error);
//     res.status(500).json({ error: 'Failed to complete task' });
//   }
// });




// // Route to update user balance
// app.put('/api/users/:userId/balance', async (req, res) => {
//   const { userId } = req.params;
//   const { reward } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.balance += reward;
//     await user.save();

//     res.json({ message: 'Balance updated', balance: user.balance });
//   } catch (error) {
//     console.error('Error updating balance:', error);
//     res.status(500).json({ error: 'Failed to update balance' });
//   }
// });








// // route to update Users activities
// // const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   user_id: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const User = mongoose.model('User', userSchema);



// // handle users ID storage

// app.post('/api/users', async (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   try {
//     // Check if the user already exists
//     let user = await User.findOne({ user_id });
//     if (!user) {
//       // Create a new user if not found
//       user = new User({ user_id });
//       await user.save();
//     }

//     res.json({ message: 'User ID saved successfully', user });
//   } catch (error) {
//     console.error('Error saving user ID:', error);
//     res.status(500).json({ error: 'Failed to save user ID' });
//   }
// });


// // Tracking User Activities in MongoDB

// app.put('/api/users/:userId/track', async (req, res) => {
//   const { userId } = req.params;
//   const { action } = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { user_id: userId },
//       { $set: { lastActiveAt: new Date() }, $push: { actions: action } },
//       { new: true, upsert: true }
//     );

//     res.json({ message: 'User activity tracked', user });
//   } catch (error) {
//     console.error('Error tracking user activity:', error);
//     res.status(500).json({ error: 'Failed to track activity' });
//   }
// });







// // From here start the refer-server.js code which controls the entire task server functionalities

// // const express = require("express");
// // const { MongoClient, ObjectId } = require("mongodb");
// const bodyParser = require("body-parser");

// // const app = express();
// app.use(bodyParser.json());

// const mongoURI = "mongodb+srv://dbUser:dbUserpass@telegrambot.yngj8.mongodb.net/?retryWrites=true&w=majority";
// let db;

// MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
//     if (err) throw err;
//     db = client.db("telegramMiniApp");
//     console.log("Connected to MongoDB");
// });

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

// // app.listen(5000, () => console.log("Referral server running on port 5000"));












// // Here are the codes that controls all the wallet-server.js scripts

