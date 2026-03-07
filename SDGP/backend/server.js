const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// 1. Initialize Express App
const app = express();

// 2. Connect to MongoDB Database
connectDB();

// 3. Setup Middleware
app.use(cors()); // Frontend ekath ekka connect wenna
app.use(express.json()); // JSON data handle karanna

// 4. API Routes Connection
// Auth routes (Login, Register, Settings)
app.use('/api/auth', require('./routes/authRoutes'));

// Skills & Dashboard routes (Careers, Home, Quiz, Results, SkillGap)
app.use('/api/skills', require('./routes/skillRoutes'));

// 5. Error Handling Middleware (Optional but good)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong on the server!' });
});

// 6. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    console.log(`✅ API Endpoints are ready for Frontend.`);
});
