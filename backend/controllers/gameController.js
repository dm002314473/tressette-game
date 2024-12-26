const { default: mongoose } = require("mongoose");
const Game = require("../models/Game");
const User = require("../models/User");

const CreateGame = async (req, res) => {
  try {
    const { userId, type, isPrivate } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ message: "Sva polja su obavezna" });
    }

    const validTypes = ["2-players", "4-players"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Neispravan tip igre" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }

    const joinCode = isPrivate
      ? Math.random().toString(36).substr(2, 8).toUpperCase()
      : null;

    const newGame = new Game({
      gameId: new mongoose.Types.ObjectId().toString(),
      createdBy: userId,
      players: [{ userId, username: user.username, isReady: false }],
      type,
      isPrivate,
      joinCode,
      createdAt: new Date(),
      status: "waiting",
    });

    await newGame.save();

    return res
      .status(201)
      .json({ message: "Igra uspješno kreirana", gameId: newGame.gameId });
  } catch (error) {
    console.error("Greška pri kreiranju igre: ", error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

const JoinGame = async (req, res) => {
  try {
    const { gameId, userId } = req.body;

    if (!gameId || !userId) {
      return res.status(400).json({ message: "Sva polja su obavezna" });
    }

    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ message: "Igra ne postoji" });
    }

    const isAlreadyInGame = game.players.some(
      (player) => player.userId.toString() === userId
    );
    if (isAlreadyInGame) {
      return res.status(400).json({ message: "Korisnik je već u igri" });
    }

    const user = await User.findById(userId);
    game.players.push({ userId, username: user.username, isReady: false });
    await game.save();

    return res
      .status(200)
      .json({ message: "Uspješno ste pridruženi igri", gameId: game.gameId });
  } catch (error) {
    console.error("Greška pri pridruživanju igri: ", error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

const JoinGameByCode = async (req, res) => {
  try {
    const { gameCode, userId } = req.body;

    if (!gameCode || !userId) {
      return res.status(400).json({ message: "Sva polja su obavezna" });
    }

    const game = await Game.findOne({ joinCode: gameCode });
    if (!game) {
      return res.status(404).json({ message: "Igra ne postoji" });
    }

    const isAlreadyInGame = game.players.some(
      (player) => player.userId.toString() === userId
    );
    if (isAlreadyInGame) {
      return res.status(400).json({ message: "Korisnik je već u igri" });
    }

    const user = await User.findById(userId);
    game.players.push({ userId, username: user.username, isReady: false });
    await game.save();

    return res
      .status(200)
      .json({ message: "Uspješno ste pridruženi igri", gameId: game.gameId });
  } catch (error) {
    console.error("Greška pri pridruživanju igri: ", error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

module.exports = { CreateGame, JoinGame, JoinGameByCode };
