const express = require("express");
const Blog = require("../models/Blog");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const blog = await Blog.create({
      user: req.userId,
      content: req.body.content
    });
    res.json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Server error while creating blog" });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    console.log("Fetching blogs for userId:", req.userId);
    const blogs = await Blog.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);  // <- this logs the exact cause
    res.status(500).json({ message: "Server error while fetching blogs" });
  }
});




module.exports = router;
