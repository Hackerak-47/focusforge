const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subject: String,
  hours: Number,
  date: Date
}, { timestamps: true });

module.exports = mongoose.model("Planner", plannerSchema);
