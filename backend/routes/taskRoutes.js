const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");
const router = express.Router();


router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", auth, async (req, res) => {
  console.log("Token from headers:", req.headers.authorization); 
  console.log("req.userId from middleware:", req.userId);        
  console.log("req.body.content:", req.body.content);           

  try {
    const task = await Task.create({
      user: req.userId,
      content: req.body.content
    });
    res.json(task);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  }   catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
