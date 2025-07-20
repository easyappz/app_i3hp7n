const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /profile/:id - View any user's profile (authenticated)
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

// PUT /profile - Update own profile (authenticated)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    if (err.codeName === 'DuplicateKey') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
