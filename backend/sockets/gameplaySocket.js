const loadActiveGames = require("./loadActiveGames");
const Deck = require("../models/Deck");
const Game = require("../models/Game");

let activeGames = {};

const initializeGames = async () => {
  activeGames = await loadActiveGames();
};

module.exports = (io) => {
  //novo
  const gameDeck = {};
  let currentGame = {};

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("joinGame", async (gameId) => {
      await initializeGames();

      socket.join(gameId);

      console.log(`player ${socket.id} joined game ${gameId}`);

      //novo
      currentGame = await Game.findOne({ _id: gameId });
      console.log("current game: ", currentGame);

      //novo
      const deck = new Deck();
      gameDeck[gameId] = deck.deal(2);
    });

    socket.on("sendMessage", (roomId) => {
      console.log("roomId: ", roomId);
      console.log(gameDeck[roomId].hands);
      //novo
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        const socketIds = Array.from(room);
        console.log(`Sockets in room ${roomId}:`, socketIds);
        gameDeck[roomId].hands[0].forEach((element) => {
          element.playerId = socketIds[0];
        });
        gameDeck[roomId].hands[1].forEach((element) => {
          element.playerId = socketIds[1];
        });
      } else {
        console.log(`Room ${roomId} does not exist or is empty.`);
      }
      //console.log("certain card: ", gameDeck[roomId].hands[0][0].suit); returns certain card from certain hand
      //novo gameDeck(remaining deck, hands for player 1 and 2), currentGame(data from DB of game with _id: roomId)
      socket.to(roomId).emit("receiveMessage", gameDeck[roomId], currentGame);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
