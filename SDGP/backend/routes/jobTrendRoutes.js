const express = require('express');

const router = express.Router();

// Hardcoded mock data exactly matching frontend expectations
const ROLES = [
  "Software Engineer",
  "Data Scientist", 
  "Frontend Developer",
  "AI Engineer"
];

const POINTS = [
  { title: "Software Engineer", demand: 120, monthLabel: "Jan", date: "2024-01-01" },
  { title: "Software Engineer", demand: 140, monthLabel: "Feb", date: "2024-02-01" },
  { title: "Software Engineer", demand: 160, monthLabel: "Mar", date: "2024-03-01" }
];

const LATEST_ROLE_DEMANDS = [
  { title: "Software Engineer", demand: 160 },
  { title: "Data Scientist", demand: 130 },
  { title: "Frontend Developer", demand: 110 }
];

const STATS = {
  role: "Software Engineer",
  latestDemand: 160,
  previousDemand: 140,
  growthPct: 14.2,
  averageDemand: 140,
  peakDemand: 160,
  lowDemand: 120,
  monthsTracked: 3,
  activeRoles: 4
};

// GET /api/job-trends/roles
router.get('/roles', (req, res) => {
  res.json(ROLES);
});

// GET /api/job-trends
router.get('/', (req, res) => {
  res.json({
    points: POINTS,
    latestRoleDemands: LATEST_ROLE_DEMANDS
  });
});

// GET /api/job-trends/stats  
router.get('/stats', (req, res) => {
  res.json(STATS);
});

module.exports = router;
