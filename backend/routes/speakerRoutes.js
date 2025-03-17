const express = require('express');
const {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker
} = require('../controllers/speakerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getSpeakers);
router.get('/:id', getSpeakerById);

// Protected routes - require authentication
router.post('/', protect, createSpeaker);
router.put('/:id', protect, updateSpeaker);
router.delete('/:id', protect, deleteSpeaker);

module.exports = router; 