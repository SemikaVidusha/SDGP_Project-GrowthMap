const {
  JobTrend,
  formatMonthLabel,
  getLatestRoleDemands,
} = require('../services/jobTrendService');

const MONTHS_DEFAULT = 24;
const MONTHS_MAX = 60;

const parseMonths = (rawMonths) => {
  const parsed = Number.parseInt(rawMonths, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return MONTHS_DEFAULT;
  }
  return Math.min(parsed, MONTHS_MAX);
};

const normalizeTrendPoint = (point) => ({
  id: point._id?.toString?.() || undefined,
  title: point.title,
  demand: point.demand,
  date: point.date,
  monthLabel: formatMonthLabel(point.date),
});

const aggregateAllRolesByMonth = (points) => {
  const byMonth = new Map();

  points.forEach((point) => {
    const date = new Date(point.date);
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

    if (!byMonth.has(key)) {
      byMonth.set(key, {
        date: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)),
        totalDemand: 0,
        sampleCount: 0,
      });
    }

    const monthRow = byMonth.get(key);
    monthRow.totalDemand += point.demand;
    monthRow.sampleCount += 1;
  });

  return Array.from(byMonth.values())
    .sort((a, b) => a.date - b.date)
    .map((monthRow) => ({
      title: 'All Roles',
      demand: Math.round(monthRow.totalDemand / Math.max(monthRow.sampleCount, 1)),
      date: monthRow.date,
      monthLabel: formatMonthLabel(monthRow.date),
    }));
};

const computeStatsFromPoints = (points, activeRoles, roleName) => {
  if (!points.length) {
    return {
      role: roleName,
      latestDemand: 0,
      previousDemand: 0,
      growthPct: 0,
      averageDemand: 0,
      peakDemand: 0,
      lowDemand: 0,
      monthsTracked: 0,
      activeRoles,
    };
  }

  const latestDemand = points[points.length - 1].demand;
  const previousDemand = points.length > 1 ? points[points.length - 2].demand : latestDemand;
  const growthPct = previousDemand === 0
    ? 0
    : Number((((latestDemand - previousDemand) / previousDemand) * 100).toFixed(2));

  const totalDemand = points.reduce((sum, point) => sum + point.demand, 0);
  const averageDemand = Number((totalDemand / points.length).toFixed(2));
  const peakDemand = Math.max(...points.map((point) => point.demand));
  const lowDemand = Math.min(...points.map((point) => point.demand));

  return {
    role: roleName,
    latestDemand,
    previousDemand,
    growthPct,
    averageDemand,
    peakDemand,
    lowDemand,
    monthsTracked: points.length,
    activeRoles,
  };
};

const getRoles = async (req, res) => {
  try {
    const roles = await JobTrend.distinct('title');
    roles.sort((a, b) => a.localeCompare(b));
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const role = typeof req.query.role === 'string' ? req.query.role.trim() : '';
    const months = parseMonths(req.query.months);
    const activeRoles = await JobTrend.distinct('title');

    let points;
    if (role) {
      const rolePoints = await JobTrend.find({ title: role }).sort({ date: 1 }).lean();
      points = rolePoints.slice(-months).map(normalizeTrendPoint);
    } else {
      const allPoints = await JobTrend.find().sort({ date: 1 }).lean();
      points = aggregateAllRolesByMonth(allPoints).slice(-months);
    }

    res.json(computeStatsFromPoints(points, activeRoles.length, role || 'All Roles'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTrends = async (req, res) => {
  try {
    const role = typeof req.query.role === 'string' ? req.query.role.trim() : '';
    const months = parseMonths(req.query.months);

    const query = role ? { title: role } : {};
    const rawPoints = await JobTrend.find(query).sort({ date: 1 }).lean();

    const points = role
      ? rawPoints.slice(-months).map(normalizeTrendPoint)
      : aggregateAllRolesByMonth(rawPoints).slice(-months);

    const latestRoleDemands = await getLatestRoleDemands();

    res.json({
      role: role || null,
      points,
      latestRoleDemands,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRoles,
  getStats,
  getTrends,
};