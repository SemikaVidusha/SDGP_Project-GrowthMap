const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, deleteProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public settings for MVP demo - no auth required
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Keep delete protected
router.delete('/profile', auth, deleteProfile);

module.exports = router;
