const loadActiveGames = require("./loadActiveGames");
const Deck = require("../models/Deck");

let activeGames = {};

const initializeGames = async () => {
  activeGames = await loadActiveGames();
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinGame", async (gameId, userId) => {
      await initializeGames();
      const game = Object.values(activeGames).find(
        (g) => g._id.toString() === gameId
      );

      console.log("gameId in join game of active game: ", game?._id);

      if (game) {
        // Find the player and assign their socketId
        const player = game.players.find(
          (p) => p.userId.toString() === userId.toString()
        );
        if (player) {
          player.socketId = socket.id; // Assign socketId to the player's data

          // Emit to all players to update the game state
          io.to(gameId).emit("gameUpdated", game); // Notify all players of the updated game state
        } else {
          console.log(`Player with ID ${userId} not found in game.`);
        }

        socket.join(gameId);
      } else {
        console.log(`Game with ID ${gameId} not found.`);
      }
    });

    // Dijeljenje karata za novu igru
    socket.on("startGame", async (gameId) => {
      const deck = new Deck();
      const { hands, remainingDeck } = deck.deal(2);

      const game = Object.values(activeGames).find(
        (g) => g._id.toString() === gameId
      );

      if (game) {
        if (game.players.length !== hands.length) {
          console.log("Mismatch between players and dealt hands.");
          return;
        }

        // Attach hands to players dynamically
        game.players.forEach((player, index) => {
          player.hand = hands[index]; // Temporarily store hands in memory or database
        });

        // await game.save(); // Persist game state with assigned hands if required

        // Emit hands to players using their `userId`
        game.players.forEach((player, index) => {
          const userHand = hands[index];
          console.log(
            `hand for player ${player.username})(${player.userId}):`,
            userHand
          );
          io.to(player.socketId).emit("gameStarted", {
            hand: userHand,
            remainingDeck,
            game: {
              ...game.toObject(),
              players: undefined, // Exclude private data when broadcasting to everyone
            },
          });
        });

        console.log(`Game ${gameId} started, cards dealt to players.`);
      } else {
        console.log(`Game with ID ${gameId} not found.`);
      }
    });

    // Diskonekt
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);

      // Iterate over all active games to find and remove the player who disconnected
      Object.values(activeGames).forEach((game) => {
        game.players.forEach((player) => {
          if (player.socketId === socket.id) {
            player.socketId = null; // Reset the socketId when a player disconnects
            io.to(game._id.toString()).emit("gameUpdated", game); // Notify all players
          }
        });
      });
    });
  });
};
