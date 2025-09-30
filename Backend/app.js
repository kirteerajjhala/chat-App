const express = require("express");
const { app, server } = require("../Backend/socketio/socket");
const mongoDb = require("../Backend/DataBase/db");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("../Backend/Routes/auth.Router");
const userRouter = require("../Backend/Routes/userRoutes");
const path = require("path");
const cookieParser = require("cookie-parser");
const messageRouter = require("../Backend/Routes/messageRoutes");

dotenv.config();

// agar .env me PORT nahi mila to default 8000 le lega
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend url
    credentials: true,
  })
);

// Static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Database connect
mongoDb();

// Server start with error handling
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use. Try another port.`);
  } else {
    console.error("❌ Server error:", err);
  }
});
