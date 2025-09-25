const express = require("express");
const { initSocket } = require("./socketio/socket");
const mongoDb = require("./DataBase/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
  credentials: true
}));
app.use("/public", express.static(path.join(__dirname, "public")));

// Routers
const authRouter = require("./Routes/auth.Router");
const userRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoutes");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => res.send("Hello World!"));
app.use((req, res) => res.status(404).send("404 Not Found"));

// DB connect
mongoDb();

// Local development only: server + socket.io
// if (process.env.NODE_ENV !== "production") {
//   const http = require("http").createServer(app);
//   initSocket(http);
//   const PORT = process.env.PORT || 4000;
//   http.listen(PORT, () => console.log("Server running on port", PORT));
// }

// Vercel export
module.exports = app;
