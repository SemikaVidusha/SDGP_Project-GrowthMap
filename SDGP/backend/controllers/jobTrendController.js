const ROLES = ["Software Engineer", "Data Scientist", "Frontend Developer", "AI Engineer"];

const TRENDS = {
  "points": [
    { "month": "Jan", "demand": 70, "date": "2024-01-01" },
    { "month": "Feb", "demand": 85, "date": "2024-02-01" },
    { "month": "Mar", "demand": 95, "date": "2024-03-01" }
  ],
  "latestRoleDemands": [
    { "role": "Software Engineer", "demand": 95, "date": "2024-03-01", "monthLabel": "Mar 2024" },
    { "role": "Data Scientist", "demand": 88, "date": "2024-03-01", "monthLabel": "Mar 2024" },
    { "role": "AI Engineer", "demand": 92, "date": "2024-03-01", "monthLabel": "Mar 2024" }
  ]
};

const STATS = {
  "averageDemand": 83,
  "trend": "increasing",
  "topRole": "Software Engineer",
  "latestDemand": 95,
  "previousDemand": 85,
  "growthPct": 11.76,
  "peakDemand": 95,
  "lowDemand": 70,
  "monthsTracked": 3,
  "activeRoles": 4
};

const getRoles = (req, res) => {
  res.json(ROLES);
};

const getTrends = (req, res) => {
  res.json(TRENDS);
};

const getStats = (req, res) => {
  res.json(STATS);
};

module.exports = {
  getRoles,
  getStats,
  getTrends,
}; 
