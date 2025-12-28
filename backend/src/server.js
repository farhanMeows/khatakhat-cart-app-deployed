require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB } = require("./config/database");
const setupSocketIO = require("./services/socketService");
const CartStatusService = require("./services/cartStatusService");
const { startSimulation } = require("./locationSimulationService");

// Routes
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/carts");
const locationRoutes = require("./routes/location");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/location", locationRoutes);

// Health
app.get("/", (req, res) => {
  res.json({ status: "running" });
});

// Init
const initializeServer = async () => {
  await connectDB();
  setupSocketIO(io);

  const cartStatusService = new CartStatusService(io);
  cartStatusService.start();
};

// 🔥 START SERVER FIRST
const PORT = process.env.PORT || 5001;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, async () => {
  console.log(`🚀 CartSync Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

  try {
    await initializeServer();

    // ✅ Start simulation ONLY after server is listening
    if (process.env.ENABLE_SIMULATION === "true") {
      await startSimulation();
    }
  } catch (err) {
    console.error("Startup error:", err);
  }
});

// Keep Render alive (debug)
setInterval(() => {
  console.log("🟢 Server alive");
}, 15000);

module.exports = { app, server, io };
