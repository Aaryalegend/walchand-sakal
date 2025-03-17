const express = require('express');
const {
  getAboutContent,
  createAboutContent,
  updateAboutContent
} = require('../controllers/aboutContentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAboutContent);

// Protected routes
router.post('/', protect, createAboutContent);
router.put('/:id', protect, updateAboutContent);

module.exports = router; 