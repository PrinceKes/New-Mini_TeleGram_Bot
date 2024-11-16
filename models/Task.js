const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  category: { type: String, required: false },
  isCompleted: { type: Boolean, default: false },
  link: String // New field for link
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
