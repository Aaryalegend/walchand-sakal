const express = require('express');
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getTeamMembers);
router.get('/:id', getTeamMemberById);

// Protected routes - require authentication
router.post('/', protect, createTeamMember);
router.put('/:id', protect, updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router; 