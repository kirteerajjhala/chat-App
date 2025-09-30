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

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://livechatappbykirteeraj.onrender.com",
    credentials: true,
  })
);

// Serve public folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Serve React frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// Catch-all to serve React for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Database connect
mongoDb();

// Server start
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use. Try another port.`);
  } else {
    console.error("❌ Server error:", err);
  }
});
