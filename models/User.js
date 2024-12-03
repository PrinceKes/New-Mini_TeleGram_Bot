const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, default: null },
  balance: { type: Number, default: 0 },
  actions: [String],
  lastActiveAt: { type: Date },
  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

module.exports = mongoose.model('User', userSchema);
