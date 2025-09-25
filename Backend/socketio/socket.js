// socketio/socket.js
const { Server } = require("socket.io");

// userId -> socketId mapping
const userSocketMap = {};
let io; // singleton

/**
 * Initialize Socket.io server
 * @param {http.Server} server - Optional, only for local dev (commented out for Vercel)
 * @returns io instance
 */
const initSocket = (server) => {
  // Local dev code is commented out for Vercel
  /*
  if (!io && server) {
    io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "https://your-frontend.vercel.app"
        ],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      const userId = socket.handshake.query.userId;
      if (userId) userSocketMap[userId] = socket.id;

      // Emit online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    });
  }
  */
  return io;
};

/**
 * Helper to get receiver socket id by userId
 * @param {string} receiver
 * @returns {string|undefined}
 */
const getReceiverSocketId = (receiver) => userSocketMap[receiver];

module.exports = {
  initSocket,          // Vercel me sirf exported function (local server optional)
  userSocketMap,       // userId -> socketId mapping
  getReceiverSocketId, // helper function
};
