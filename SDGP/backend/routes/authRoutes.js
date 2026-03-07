const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/signup - Register new user
router.post('/signup', registerUser);

// POST /api/auth/login - Authenticate user
router.post('/login', loginUser);

// PUT /api/auth/update-password - Update password (requires auth)
router.put('/update-password', auth, updatePassword);

module.exports = router;
