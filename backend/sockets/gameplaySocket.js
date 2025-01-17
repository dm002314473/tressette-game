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

      const room = io.sockets.adapter.rooms.get(gameId);
      if (room) {
        const socketIds = Array.from(room);
        console.log(`Players in room ${gameId}:`, socketIds);

        currentGame = await Game.findOne({ id: gameId.id });
        if (!currentGame) {
          console.error(`Game ${gameId} not found.`);
          return;
        }

        currentGame.players = socketIds.map((socketId, index) => ({
          userId: `user${index + 1}`,
          socketId,
        }));

        if (socketIds.length.toString() === currentGame.type) {
          console.log(`All players have joined. Starting game ${gameId}.`);

          const deck = new Deck();
          gameDeck[gameId] = deck.deal(currentGame.type);

          for (let i = 0; i < socketIds.length; i++) {
            gameDeck[gameId]?.hands[i]?.forEach((card) => {
              card.playerId = socketIds[i];
            });
          }

          io.to(gameId).emit("startGame", gameDeck[gameId], currentGame);
        }
      }
    });

    socket.on("playMove", async ({ card, gameId }) => {
      const currentGame = await Game.findOne({ id: gameId.id });

      console.log(currentGame);

      console.log(currentGame.turn, socket.id);
      if (currentGame.turn !== socket.id) {
        console.log("Not your turn");
        return;
      }

      console.log("WE PLAYED THE CARD");

      playedCards.push({ playerId: socket.id, card });

      // Check if all players have played
      if (playedCards.length === currentGame.players.length) {
        // Determine the round winner
        const roundWinner = calculateRoundWinner(
          playedCards,
          currentGame.firstPlayer
        );

        // Update the game state with the winner
        currentGame = updateGameState(currentGame, roundWinner);

        // Clear played cards for the next round
        currentGame.playedCards = [];

        // Emit updated game state
        io.to(gameId).emit("roundEnded", currentGame);
      } else {
        // Emit updated game state to all players, including the next player's turn
        io.to(gameId).emit("gameUpdate", currentGame);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
