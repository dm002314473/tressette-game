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

      currentGame = await Game.findOne({ id: gameId.id });
      if (!currentGame) {
        console.error(`Game ${gameId} not found.`);
        return;
      }

      const room = io.sockets.adapter.rooms.get(gameId);
      if (room) {
        const socketIds = Array.from(room);
        console.log(`Players/Sockets in room ${gameId}:`, socketIds);

        if (socketIds.length.toString() === currentGame.type) {
          console.log(`All players have joined. Starting game ${gameId}.`);

          const deck = new Deck();
          gameDeck[gameId] = deck.deal(currentGame.type);

          console.log(gameDeck[gameId].hands[0][0]);

          const randomIndex = Math.floor(Math.random() * socketIds.length);
          currentGame.turn = socketIds[randomIndex];

          currentGame.remainingDeck = gameDeck[gameId].remainingDeck;

          for (let i = 0; i < socketIds.length; i++) {
            if (!currentGame.players[i]) {
              console.warn(`Player ${i} does not exist in game ${gameId}`);
              continue;
            }

            currentGame.players[i].socketId = socketIds[i];

            if (gameDeck[gameId] && gameDeck[gameId].hands[i]) {
              console.log("KARTA PRIJE MAP: ", gameDeck[gameId].hands[i][0]);
              currentGame.players[i].hand = gameDeck[gameId].hands[i].map(
                (card) => ({
                  ...card,
                  playerId: currentGame.players[i].socketId,
                })
              );
              console.log("KARTA NAKON MAP: ", currentGame.players[i].hand[0]);
            } else {
              console.error(
                `Hand data missing for player ${i} in game ${gameId}`
              );
            }
          }
        }

        try {
          await Game.findByIdAndUpdate(gameId, currentGame, {
            new: true,
          });
          console.log(`Game ${gameId} updated successfully.`);
        } catch (error) {
          console.error(`Failed to update game ${gameId}:`, error);
        }

        if (socketIds.length.toString() === currentGame.type) {
          io.to(gameId).emit("startGame", currentGame);
        }
      }
    });

    socket.on("playMove", async ({ card, gameId }) => {
      const currentGame = await Game.findOne({ id: gameId.id });

      console.log(currentGame.turn, card.playerId);
      if (currentGame.turn !== card.playerId) {
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
