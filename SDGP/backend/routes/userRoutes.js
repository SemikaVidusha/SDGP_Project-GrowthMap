const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSettings, updateSettings, deleteProfile } = require('../controllers/userController');

// @route   GET /api/users/settings
// @desc    Get current user settings
// @access  Private
router.get('/settings', auth, getSettings);

// @route   PUT /api/users/settings
// @desc    Update current user settings
// @access  Private
router.put('/settings', auth, updateSettings);

// @route   DELETE /api/users/profile
// @desc    Delete current user and profile
// @access  Private
router.delete('/profile', auth, deleteProfile);

module.exports = router;
