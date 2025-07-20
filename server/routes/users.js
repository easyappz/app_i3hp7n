const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// GET /api/users/search?query=...
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    const users = await User.find().select('-password');
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query));
    res.json(filteredUsers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
