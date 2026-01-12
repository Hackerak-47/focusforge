const express = require("express");
const Planner = require("../models/Planner");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ADD PLAN
router.post("/", auth, async (req, res) => {
  const plan = await Planner.create({
    user: req.user.id,
    subject: req.body.subject,
    hours: req.body.hours,
    date: req.body.date
  });

  res.json(plan);
});

// GET PLANS
router.get("/", auth, async (req, res) => {
  const plans = await Planner.find({ user: req.userId })
    .sort({ date: 1 });

  res.json(plans);
});

module.exports = router;
