const loadActiveGames = require("./loadActiveGames");
const Deck = require("../models/Deck");
const Game = require("../models/Game");
const {
  playBySuit,
  changeIdOfPlayersTurn,
  updateDataBase,
  calculateRoundWinner,
  removeCardFromPlayer,
  dealNewCards,
  calculatePoints,
} = require("../utils/gameRules");

let activeGames = {};

const initializeGames = async () => {
  activeGames = await loadActiveGames();
};

module.exports = (io) => {
  const gameDeck = {};
  let currentGame = {};

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("joinGame", async (gameId, userData) => {
      await initializeGames();

      socket.join(gameId);
      console.log(
        `player ${userData?.user} with id ${userData?.id} joined game ${gameId}`
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

      if (currentGame.turn !== card.playerId) {
        return;
      }

      const currentPlayerTurn = currentGame.players.find(
        (player) => player.socketId === currentGame.turn
      );

      console.log("turn prije bacanja karte: ", currentGame.turn);
      if (currentPlayerTurn) {
        if (playBySuit(currentPlayerTurn.hand, card, currentGame.boardState)) {
          currentGame.turn = changeIdOfPlayersTurn(
            currentGame.turn,
            currentGame.players
          );
          console.log("turn poslje bacanja karte: ", currentGame.turn);

          currentPlayerTurn.hand = removeCardFromPlayer(
            currentPlayerTurn,
            card
          );

          currentGame.boardState.push(card);

          if (currentGame.boardState.length == currentGame.players.length) {
            currentGame.turn = calculateRoundWinner(currentGame.boardState);
            currentGame.players.forEach((player) => {
              if (player.socketId == currentGame.turn) {
                player.points += calculatePoints(
                  currentGame.boardState,
                  currentGame.players
                );
              }
            });
            currentGame.boardState = [];
            if (currentGame.remainingDeck.length >= currentGame.players.length)
              currentGame.players.forEach((player) => {
                player.hand = dealNewCards(currentGame, player);
              });
          }

          const allHandsEmpty = currentGame.players.every(
            (player) => Array.isArray(player.hand) && player.hand.length === 0
          );

          io.to(currentGame.id).emit("movePlayed", card, currentGame);
          if (allHandsEmpty) {
            io.to(currentGame.id).emit("gameOver", currentGame);
          }

          updateDataBase(currentGame);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
