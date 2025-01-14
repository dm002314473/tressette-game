const loadActiveGames = require("./loadActiveGames");
const Deck = require("../models/Deck");

let activeGames = {};

const initializeGames = async () => {
  activeGames = await loadActiveGames();
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("joinGame", async (gameId) => {
      await initializeGames();

      socket.join(gameId);

      console.log(`player ${socket.id} joined game ${gameId}`);
    });

    socket.on("sendMessage", (roomId, message) => {
      console.log(roomId);
      socket.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
