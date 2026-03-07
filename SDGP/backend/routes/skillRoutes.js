const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    getUserDashboardData, 
    setTargetRole, 
    saveQuizResult, 
    processSkillGap 
} = require('../controllers/skillController');

// Home & Profile Data
router.get('/dashboard', auth, getUserDashboardData);

// Careers Page - Role Selection
router.post('/set-role', auth, setTargetRole);

// Quiz Page
router.post('/quiz-submit', auth, saveQuizResult);

// Skill Gap Page
router.post('/analyze-gap', auth, processSkillGap);

module.exports = router;