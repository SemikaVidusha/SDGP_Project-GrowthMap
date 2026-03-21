require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect DB (DISABLED for demo - prevents crash without MongoDB)
// connectDB();

console.log('🚀 Server starting WITHOUT database connection...');
console.log('✅ Job trends endpoints now use mock data!');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/job-trends", require("./routes/jobTrendRoutes"));

// Optional: test route
app.get("/", (req, res) => {
  res.send("API running... Job trends available without DB!");
});

// Port
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
