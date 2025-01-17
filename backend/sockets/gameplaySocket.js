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

    socket.on("joinGame", async (gameId, userData) => {
      await initializeGames();

      socket.join(gameId);

      console.log(
        `player ${userData.user} with id ${userData.id} joined game ${gameId}`
      );
    });

    socket.on("sendMessage", async (roomId) => {
      console.log("roomId: ", roomId);

      currentGame = await Game.findOne({ _id: roomId });
      console.log("current game type: ", currentGame?.type);

      const deck = new Deck();
      gameDeck[roomId] = deck.deal(currentGame?.type); //deals 2 or 4 hands of cards based on game type(2/4 players)

      //setting each card from hands id of player in which hands they are
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        const socketIds = Array.from(room);
        console.log(`Sockets in room ${roomId}:`, socketIds);
        for (let i = 0; i < socketIds.length; i++) {
          if (currentGame && currentGame.players[i]) {
            currentGame.players[i].socketId = socketIds[i];
            gameDeck[roomId]?.hands[i]?.forEach((element) => {
              element.playerId = currentGame.players[i]._id;
            });
            currentGame.players[i].hand = gameDeck[i].hands[i];
          }
        }
      } else {
        console.log(`Room ${roomId} does not exist or is empty.`);
      }

      socket.to(roomId).emit("receiveMessage", gameDeck[roomId], currentGame);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
