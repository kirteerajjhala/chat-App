const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend ka URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// userId -> socketId mapping
const userSocketMap = {};

// helper function
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // frontend se query params ke through userId bhejna hoga
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("🔗 User connected:", userId);
  }

  // online users list bhej do sabko
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // disconnect event
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
      console.log("🔗 User removed:", userId);
    }

    // updated online users bhejna
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, userSocketMap, getReceiverSocketId };
