const Game = require("../models/Game");

const loadActiveGames = async () => {
  let activeGames = {};
  try {
    const games = await Game.find({ status: "active" });

    games.forEach((game) => {
      activeGames[game.gameId] = game;
    });

    console.log("Active games loaded from DB:", activeGames);
    return activeGames;
  } catch (err) {
    console.error("Failed to load games:", err);
    return {};
  }
};

module.exports = loadActiveGames;