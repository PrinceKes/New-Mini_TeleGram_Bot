const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String },
  balance: { type: Number, default: 0 },
  actions: [String],
  lastActiveAt: { type: Date },
  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // References completed tasks
});

module.exports = mongoose.model('User', userSchema);






// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//   user_id: { type: String, required: true, unique: true },
//   balance: { type: Number, default: 0 },
//   actions: [String],
//   lastActiveAt: Date,
// });

// module.exports = mongoose.model('User', userSchema);
