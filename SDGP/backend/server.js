require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { initializeJobTrendsRealtime } = require("./realtime/jobTrendsRealtime");

const app = express();
const server = http.createServer(app);

// Socket.IO CORS
const socketOrigin = process.env.FRONTEND_ORIGIN || "*";
const io = new Server(server, {
  cors: {
    origin: socketOrigin,
    methods: ["GET", "POST"],
  },
});

// Optional DB connection
const USE_DB = process.env.USE_DB === "true";

if (USE_DB) {
  connectDB();
  console.log("✅ Database connected.");
} else {
  console.log("🚀 Server starting WITHOUT database connection...");
  console.log("✅ Job trends endpoints now use mock data!");
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/job-trends", require("./routes/jobTrendRoutes"));

// Test route
app.get("/", (req, res) => {
  if (USE_DB) {
    res.send("API running with database connection!");
  } else {
    res.send("API running... Job trends available without DB!");
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong on the server!" });
});

// Realtime job trends
const jobTrendsRealtime = initializeJobTrendsRealtime(io);

// Port
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
  console.log("✅ API Endpoints are ready for Frontend.");
  jobTrendsRealtime.startSimulation();
});

// Graceful shutdown
const shutdown = () => {
  jobTrendsRealtime.stopSimulation();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);