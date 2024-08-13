const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/dbconfig");
const userRouter = require("./routes/userRouter");
const { transactionRouter } = require("./routes/transactionRouter");

dotenv.config();

// Initialize express app
const app = express();

// Connect to the database
connectDb();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Add this line
app.use(cors());

// Routes
app.use("/api", userRouter);
app.use("/api", transactionRouter);

// Test route to verify body parsing
app.post('/test', (req, res) => {
    console.log("Test Route Body:", req.body);
    res.send(req.body);
});

// Root endpoint
app.get("/app", (req, res) => {
  res.send("Welcome to the app");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
