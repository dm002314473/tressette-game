const loadActiveGames = require("./loadActiveGames");
const Deck = require("../models/Deck");
const Game = require("../models/Game");
const Users = require("../models/User");
const {
  playBySuit,
  changeIdOfPlayersTurn,
  updateDataBase,
  calculateRoundWinner,
  removeCardFromPlayer,
  dealNewCards,
  calculatePoints,
  calculateEndPoints,
  calculateUltima,
  dataForUserUpdate,
} = require("../utils/gameRules");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { forEach } = require("lodash");

const client = new MongoClient(process.env.MONGO_URI);

let activeGames = {};

const initializeGames = async () => {
  activeGames = await loadActiveGames();
};

const deleteGame = async (game) => {
  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("games");

    const filter = { gameId: game.gameId };

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 1) {
      console.log("Successfully deleted one game.");
    } else {
      console.log("No document matched the query.");
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  } finally {
    await client.close();
  }
};

const updateUser = async (userId, username, gameType, win) => {
  try {
    const user = await Users.findOne({ username: username });

    if (!user) {
      console.log("User not found");
      return null;
    }

    const totalWins = win ? user.stats.totalWins + 1 : user.stats.totalWins;
    const win1v1 = gameType === "2" ? user.stats.win1v1 + 1 : user.stats.win1v1;
    const win2v2 = gameType === "4" ? user.stats.win2v2 + 1 : user.stats.win2v2;
    const played = user.stats.played + 1;
    const winPercentage = Number((totalWins / played).toFixed(2)) * 100;

    const userToUpdate = await Users.findByIdAndUpdate(
      userId,
      {
        $set: {
          "stats.totalWins": totalWins,
          "stats.win1v1": win1v1,
          "stats.win2v2": win2v2,
          "stats.winPercentage": winPercentage,
          "stats.played": played,
        },
      },
      { new: true }
    );

    if (!userToUpdate) {
      console.log("User not found");
      return null;
    }

    return userToUpdate;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
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

      if (currentPlayerTurn) {
        if (playBySuit(currentPlayerTurn.hand, card, currentGame.boardState)) {
          currentGame.turn = changeIdOfPlayersTurn(
            currentGame.turn,
            currentGame.players
          );

          currentPlayerTurn.hand = removeCardFromPlayer(
            currentPlayerTurn,
            card
          );

          currentGame.boardState.push(card);

          if (currentGame.boardState.length === currentGame.players.length) {
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
            currentGame.players.forEach((player) => {
              player.points += calculateUltima(
                player,
                currentGame.players,
                currentGame.turn
              );
            });
            const points = calculateEndPoints(currentGame.players);
            io.to(currentGame.id).emit("gameOver", points, currentGame.type);

            currentGame.players.forEach((player) => {
              const dataArray = dataForUserUpdate(
                player,
                currentGame.type,
                currentGame.players
              );
              updateUser(
                dataArray[0],
                dataArray[1],
                dataArray[2],
                dataArray[3]
              );
            });

            deleteGame(currentGame);
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
