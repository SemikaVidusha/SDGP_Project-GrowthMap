const JobTrend = require('../models/JobTrend');

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatMonthLabel = (date) => monthFormatter.format(new Date(date));

const toTrendPointPayload = (trendPoint) => ({
  id: trendPoint._id?.toString?.() || undefined,
  title: trendPoint.title,
  demand: trendPoint.demand,
  date: trendPoint.date,
  monthLabel: formatMonthLabel(trendPoint.date),
});

const getLatestRoleDemands = async () => {
  const latestByRole = await JobTrend.aggregate([
    { $sort: { date: -1 } },
    {
      $group: {
        _id: '$title',
        demand: { $first: '$demand' },
        date: { $first: '$date' },
      },
    },
    {
      $project: {
        _id: 0,
        title: '$_id',
        demand: 1,
        date: 1,
      },
    },
    { $sort: { demand: -1 } },
  ]);

  return latestByRole.map((row) => ({
    ...row,
    monthLabel: formatMonthLabel(row.date),
  }));
};

module.exports = {
  JobTrend,
  clamp,
  formatMonthLabel,
  getLatestRoleDemands,
  toTrendPointPayload,
};