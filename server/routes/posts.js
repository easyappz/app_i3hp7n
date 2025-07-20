const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// GET /api/posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const all = req.query.all === 'true';
    let query = {};
    if (!all) {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const friendIds = user.friends.map(id => id);
      friendIds.push(user._id);
      query = { userId: { $in: friendIds } };
    }
    const posts = await Post.find(query).sort({ createdAt: -1 }).populate('userId', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({ userId: req.user.userId, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
