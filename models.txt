const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    userId: String,
    username: String,
    firstName: String,
    lastName: String,
    ipAddress: String,
    pointBalance: { type: Number, default: 0 },
    tasksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

// Task Schema
const taskSchema = new mongoose.Schema({
    description: String,
    rewardPoints: Number,
    isActive: Boolean,
    url: String
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { User, Task };
