const express = require('express');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const dialogRoutes = require('./routes/dialogs');
const profileRoutes = require('./routes/profile');
const authMiddleware = require('./middleware/auth');

const router = express.Router();

// Public routes
router.use(authRoutes);

// Protected routes
router.use('/users', authMiddleware, userRoutes);
router.use('/posts', authMiddleware, postRoutes);
router.use('/messages', authMiddleware, messageRoutes);
router.use('/dialogs', authMiddleware, dialogRoutes);
router.use('/profile', authMiddleware, profileRoutes);

// Legacy routes can be kept or removed as needed
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
