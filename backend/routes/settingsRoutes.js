const express = require('express');
const {
  getSettings,
  createSettings,
  updateSettings
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getSettings);

// Protected routes
router.post('/', protect, createSettings);
router.put('/:id', protect, updateSettings);

module.exports = router; 