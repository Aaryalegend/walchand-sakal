const express = require('express');
const {
  getStats,
  getStatById,
  createStat,
  updateStat,
  deleteStat
} = require('../controllers/statController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getStats);
router.get('/:id', getStatById);

// Protected routes - require authentication
router.post('/', protect, createStat);
router.put('/:id', protect, updateStat);
router.delete('/:id', protect, deleteStat);

module.exports = router; 