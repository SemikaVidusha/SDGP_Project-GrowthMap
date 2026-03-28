const mongoose = require('mongoose');

const JobTrend = require('./models/JobTrend');

require('dotenv').config();

const MONTH_WINDOW = 24;

const ROLE_PROFILES = [
    { title: 'AI Engineer', base: 82, trend: 1.5, seasonal: 4, noise: 6 },
    { title: 'Data Scientist', base: 74, trend: 1.2, seasonal: 3, noise: 5 },
    { title: 'Web Developer', base: 69, trend: 0.8, seasonal: 2, noise: 5 },
    { title: 'Cyber Security Engineer', base: 78, trend: 1.3, seasonal: 3, noise: 4 },
    { title: 'Cloud Engineer', base: 71, trend: 1.0, seasonal: 3, noise: 5 },
    { title: 'DevOps Engineer', base: 73, trend: 1.1, seasonal: 3, noise: 4 },
    { title: 'UI/UX Designer', base: 62, trend: 0.6, seasonal: 2, noise: 5 },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const buildMonthlyTrend = (profile, startDate, months) => {
    const points = [];

    for (let index = 0; index < months; index += 1) {
        const date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + index, 1));
        const seasonality = Math.sin((index / 12) * Math.PI * 2) * profile.seasonal;
        const noise = Math.floor((Math.random() * 2 - 1) * profile.noise);
        const demand = Math.round(profile.base + (profile.trend * index) + seasonality + noise);

        points.push({
            title: profile.title,
            demand: clamp(demand, 20, 220),
            date,
        });
    }

    return points;
};

const seed = async () => {
    await mongoose.connect('mongodb://localhost:27017/sdgp_db');
    console.log('Connected to MongoDB for monthly job trends seeding...');

    const currentMonth = new Date();
    const startDate = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - (MONTH_WINDOW - 1), 1));

    const syntheticRecords = ROLE_PROFILES.flatMap((profile) =>
        buildMonthlyTrend(profile, startDate, MONTH_WINDOW)
    );

    await JobTrend.deleteMany({});
    await JobTrend.insertMany(syntheticRecords);

    console.log(`Job trend data seeded successfully: ${syntheticRecords.length} records across ${ROLE_PROFILES.length} roles.`);
};

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Seeding Error:', error);
        process.exit(1);
    });