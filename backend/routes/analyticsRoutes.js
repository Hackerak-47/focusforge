const express = require("express");
const Pomodoro = require("../models/PomodoroSession");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ CORRECT: path only, NO full URL
router.get("/", auth, async (req, res) => {
  const sessions = await Pomodoro.find({ user: req.userId });

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );

  res.json({
    totalSessions: sessions.length,
    totalMinutes
  });
});

module.exports = router;
