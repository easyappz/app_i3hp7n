const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Dialog = require('../models/Dialog');

const router = express.Router();

// GET /api/messages/:userId
router.get('/:userId', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const { to, content } = req.body;
    const message = new Message({ from: req.user.userId, to, content });
    await message.save();

    // Update or create dialog
    const participantIds = [req.user.userId.toString(), to.toString()]
      .sort()
      .map(id => mongoose.Types.ObjectId(id));
    let dialog = await Dialog.findOne({ participants: participantIds });
    if (!dialog) {
      dialog = new Dialog({ participants: participantIds });
    }
    dialog.lastMessage = message._id;
    dialog.updatedAt = new Date();
    await dialog.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
