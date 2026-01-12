const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// GET all tasks for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new task
router.post("/", auth, async (req, res) => {
  console.log("Token from headers:", req.headers.authorization); // <-- log token
  console.log("req.userId from middleware:", req.userId);        // <-- log userId
  console.log("req.body.content:", req.body.content);           // <-- log task content

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


// DELETE task by id
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
