// socketio/socket.js
const { Server } = require("socket.io");
const express = require("express");

const app = express();

// userId -> socketId mapping
const userSocketMap = {};
let io; // singleton

const getReceiverSocketId = (receiver) => userSocketMap[receiver];

// Init Socket.io for local dev (with HTTP server)
const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173", "https://your-frontend.vercel.app"], // add deployed frontend URL
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      const userId = socket.handshake.query.userId;
      if (userId) {
        userSocketMap[userId] = socket.id;
      }

      // Send online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    });
  }
  return io;
};

// Export for Vercel and local
module.exports = { app, initSocket, userSocketMap, getReceiverSocketId };
