// app.js (Vercel-ready)
const express = require('express');
const mongoDb = require("./DataBase/db");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

// Routers
const authRouter = require("./Routes/auth.Router");
const userRouter = require("./Routes/userRoutes");
const messageRouter = require('./Routes/messageRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173",], // add your deployed frontend URL
  credentials: true
}));

// Static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).send('404 Not 7 Found');
});

// Connect to DB
mongoDb(); // Ensure your DB URI is set in Vercel env variables

// Export app (do NOT use app.listen() for Vercel)
module.exports = app;
