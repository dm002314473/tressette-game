const loadActiveGames = require("./loadActiveGames");
const Deck = require("../models/Deck");

let activeGames = {};

const initializeGames = async () => {
  activeGames = await loadActiveGames();
};

module.exports = (io) => {
  //novo
  const gameDeck = {};
  const playerHands = {};

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("joinGame", async (gameId) => {
      await initializeGames();

      socket.join(gameId);

      console.log(`player ${socket.id} joined game ${gameId}`);

      //novo
      const deck = new Deck();
      gameDeck[gameId] = deck.deal(2);
    });

    socket.on("sendMessage", (roomId) => {
      console.log(roomId);
      //novo gameDeck
      socket.to(roomId).emit("receiveMessage", gameDeck);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
