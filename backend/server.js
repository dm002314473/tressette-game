const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/gameRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoute");
const initGamePlaySocket = require("./sockets/gameplaySocket");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

connectDB();

initGamePlaySocket(io);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
