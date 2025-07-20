const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// GET /api/messages/:userId
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user.userId, to: req.params.userId },
        { from: req.params.userId, to: req.user.userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { to, content } = req.body;
    const message = new Message({ from: req.user.userId, to, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
