const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load .env file (local me kaam karega)
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI; // dotenv ke through loaded

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("❌ MONGODB_URI not found in environment variables!");
    }
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
