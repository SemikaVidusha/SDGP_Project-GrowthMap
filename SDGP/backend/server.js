const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const JobTrend = require('./models/JobTrend');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

const socketOrigin = process.env.FRONTEND_ORIGIN || '*';
const io = new Server(server, {
    cors: {
        origin: socketOrigin,
        methods: ['GET', 'POST'],
    },
});

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/job-trends', require('./routes/jobTrendRoutes'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong on the server!' });
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const toTrendPointPayload = (trendPoint) => ({
    id: trendPoint._id?.toString?.() || undefined,
    title: trendPoint.title,
    demand: trendPoint.demand,
    date: trendPoint.date,
    monthLabel: monthFormatter.format(new Date(trendPoint.date)),
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
        monthLabel: monthFormatter.format(new Date(row.date)),
    }));
};

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

const PORT = process.env.PORT || 5000;
const simulationIntervalMs = Number.parseInt(process.env.JOB_TRENDS_SIM_INTERVAL_MS || '15000', 10);
let simulationTimer;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    console.log('✅ API Endpoints are ready for Frontend.');

    if (!Number.isNaN(simulationIntervalMs) && simulationIntervalMs > 0) {
        simulationTimer = setInterval(simulateJobTrendsUpdate, simulationIntervalMs);
        console.log(`📈 Job trends simulation is active (${simulationIntervalMs}ms interval).`);
    }
});

const shutdown = () => {
    if (simulationTimer) {
        clearInterval(simulationTimer);
    }
    server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
