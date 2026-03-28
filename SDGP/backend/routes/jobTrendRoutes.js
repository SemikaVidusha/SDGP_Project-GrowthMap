const express = require('express');

const router = express.Router();
const {
  getRoles,
  getStats,
  getTrends,
} = require('../controllers/jobTrendController');

router.get('/roles', getRoles);
router.get('/stats', getStats);
router.get('/', getTrends);

module.exports = router;
