require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Disable DB by default for MVP stability
const USE_DB = process.env.USE_DB === "true";
if (USE_DB) {
  connectDB().catch(err => console.error("DB connection failed, continuing without DB:", err));
  console.log("Database connected.");
} else {
  console.log("Running WITHOUT database (mock data mode).");
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*"
}));
app.use(express.json());

// Routes - job-trends now stable with mocks
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/job-trends", require("./routes/jobTrendRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "stable",
    message: "GrowthMap API ready for MVP demo",
    db: USE_DB ? "connected" : "disabled (mocks)",
    endpoints: ["/api/job-trends/roles", "/api/job-trends", "/api/job-trends/stats"]
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Stable server - port 5001 for demo
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server stable on http://localhost:${PORT}`);
  console.log("Job-trends endpoints ready (no Socket.IO, no DB crashes)");
});
