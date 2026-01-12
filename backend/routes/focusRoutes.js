const express = require("express");
const router = express.Router();
const Pomodoro = require("../models/PomodoroSession");
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");


// ▶️ START A SESSION (optional but useful)
router.post("/start", auth, async (req, res) => {
  const { taskId } = req.body;

  const session = await Pomodoro.create({
    user: req.userId,
    task: taskId || null,
    durationMinutes: 0,
    completed: false,
    startTime: new Date()
  });

  res.json(session);
});

router.post("/complete", auth, async (req, res) => {
  const { durationMinutes } = req.body;
  const user = await User.findById(req.userId);

  // Update total minutes & sessions
  user.totalFocusMinutes += durationMinutes;
  user.totalSessions += 1;

  // STREAK LOGIC
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of day
  const lastFocus = user.lastFocusDate ? new Date(user.lastFocusDate) : null;
  if (lastFocus) lastFocus.setHours(0, 0, 0, 0);

  if (!lastFocus || today > lastFocus) {
    // Only increment streak if last focus was before today
    user.streak += 1;
    user.lastFocusDate = new Date();
  }

  await user.save();

  res.json({ success: true, streak: user.streak });
});




// 📊 GET USER FOCUS HISTORY
router.get("/history", auth, async (req, res) => {
  const sessions = await Pomodoro.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .populate("task", "title");

  res.json(sessions);
});


// 📈 TODAY'S FOCUS TIME
router.get("/today", auth, async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const sessions = await Pomodoro.find({
    user: req.userId,
    completed: true,
    createdAt: { $gte: start }
  });

  const total = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  res.json({ totalMinutes: total });
});

module.exports = router;
