const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSettings, updateSettings } = require('../controllers/userController');

// @route   GET /api/users/settings
// @desc    Get current user settings
// @access  Private
router.get('/settings', auth, getSettings);

// @route   PUT /api/users/settings
// @desc    Update current user settings
// @access  Private
router.put('/settings', auth, updateSettings);

module.exports = router;
