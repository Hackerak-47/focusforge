const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// DASHBOARD STATS
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");

  res.json({
    name: user.name,
    email: user.email,
    streak: user.streak,
    totalFocusMinutes: user.totalFocusMinutes
  });
});

module.exports = router;
