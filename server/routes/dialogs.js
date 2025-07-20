const express = require('express');
const Message = require('../models/Message');
const Dialog = require('../models/Dialog');
const User = require('../models/User');

const router = express.Router();

// GET /api/dialogs
router.get('/', async (req, res) => {
  try {
    const dialogs = await Dialog.find({ participants: req.user.userId })
      .populate({
        path: 'lastMessage',
        populate: { path: 'from to', select: 'username' }
      })
      .populate('participants', 'username');

    const formattedDialogs = dialogs.map(dialog => {
      const otherParticipant = dialog.participants.find(p => p._id.toString() !== req.user.userId.toString());
      return {
        dialogId: dialog._id,
        otherUserId: otherParticipant ? otherParticipant._id : null,
        otherUserName: otherParticipant ? otherParticipant.username : null,
        lastMessage: dialog.lastMessage ? {
          content: dialog.lastMessage.content,
          createdAt: dialog.lastMessage.createdAt,
          from: dialog.lastMessage.from.username
        } : null,
        updatedAt: dialog.updatedAt
      };
    });

    res.json(formattedDialogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dialogs/:userId
router.get('/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user.userId, to: req.params.userId },
        { from: req.params.userId, to: req.user.userId }
      ]
    }).sort({ createdAt: 1 })
      .populate('from', 'username')
      .populate('to', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
