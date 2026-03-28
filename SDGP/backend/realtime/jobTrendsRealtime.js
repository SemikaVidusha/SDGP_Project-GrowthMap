const {
  JobTrend,
  clamp,
  getLatestRoleDemands,
  toTrendPointPayload,
} = require('../services/jobTrendService');

const initializeJobTrendsRealtime = (io) => {
  const simulationIntervalMs = Number.parseInt(
    process.env.JOB_TRENDS_SIM_INTERVAL_MS || '15000',
    10,
  );
  let simulationTimer;

  const simulateJobTrendsUpdate = async () => {
    try {
      const roles = await JobTrend.distinct('title');
      if (!roles.length) {
        return;
      }

      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const latestPoint = await JobTrend.findOne({ title: randomRole }).sort({ date: -1 });
      if (!latestPoint) {
        return;
      }

      const delta = Math.floor(Math.random() * 9) - 3;
      latestPoint.demand = clamp(latestPoint.demand + delta, 10, 300);
      await latestPoint.save();

      io.emit('job-trends:update', {
        point: toTrendPointPayload(latestPoint),
        latestRoleDemands: await getLatestRoleDemands(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to simulate job trends update:', error.message);
    }
  };

  io.on('connection', (socket) => {
    socket.emit('job-trends:connected', {
      message: 'Connected to GrowthMap live job trends.',
    });
  });

  const startSimulation = () => {
    if (!Number.isNaN(simulationIntervalMs) && simulationIntervalMs > 0) {
      simulationTimer = setInterval(simulateJobTrendsUpdate, simulationIntervalMs);
      console.log(`📈 Job trends simulation is active (${simulationIntervalMs}ms interval).`);
    }
  };

  const stopSimulation = () => {
    if (simulationTimer) {
      clearInterval(simulationTimer);
    }
  };

  return {
    startSimulation,
    stopSimulation,
  };
};

module.exports = {
  initializeJobTrendsRealtime,
};