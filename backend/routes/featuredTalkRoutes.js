const express = require('express');
const {
  getFeaturedTalks,
  getFeaturedTalkById,
  createFeaturedTalk,
  updateFeaturedTalk,
  deleteFeaturedTalk
} = require('../controllers/featuredTalkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getFeaturedTalks);
router.get('/:id', getFeaturedTalkById);

// Protected routes
router.post('/', protect, createFeaturedTalk);
router.put('/:id', protect, updateFeaturedTalk);
router.delete('/:id', protect, deleteFeaturedTalk);

module.exports = router; 