const mongoose = require("mongoose");

const PomodoroSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    default: null
  },

  durationMinutes: {
    type: Number,
    required: true
  },

  completed: {
    type: Boolean,
    default: false
  },

  startTime: Date,
  endTime: Date
}, { timestamps: true });

module.exports = mongoose.model("PomodoroSession", PomodoroSchema);
