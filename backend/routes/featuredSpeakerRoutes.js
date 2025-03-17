const express = require('express');
const {
  getFeaturedSpeakers,
  getFeaturedSpeakerById,
  createFeaturedSpeaker,
  updateFeaturedSpeaker,
  deleteFeaturedSpeaker
} = require('../controllers/featuredSpeakerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getFeaturedSpeakers);
router.get('/:id', getFeaturedSpeakerById);

// Protected routes
router.post('/', protect, createFeaturedSpeaker);
router.put('/:id', protect, updateFeaturedSpeaker);
router.delete('/:id', protect, deleteFeaturedSpeaker);

module.exports = router; 