let http = require("http");
let express = require("express");
let app = express();
let server = http.createServer(app);

let { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// userId -> socketId mapping
const userSocketMap = {};

const getReceiverSocketId = (receiver)=>{
    return userSocketMap[receiver]
}
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  // ✅ Fix: send actual userSocketMap keys
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    delete userSocketMap[userId];

    // ✅ Fix here also
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, userSocketMap ,getReceiverSocketId };
