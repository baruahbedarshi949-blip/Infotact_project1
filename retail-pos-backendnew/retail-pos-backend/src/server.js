require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// 🔥 OPTIONAL (safe load Redis)
try {
  require("./config/redis");
} catch (err) {
  console.log("⚠️ Redis not configured");
}

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // ================= DB CONNECT =================
    await connectDB();
    console.log("✅ MongoDB connected");

    // ================= SERVER START =================
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ================= ERROR HANDLING =================

    // Unhandled Promise Rejection
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

    // Uncaught Exception
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err.message);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
}

// ================= START =================
startServer();