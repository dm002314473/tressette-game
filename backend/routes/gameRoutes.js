const express = require("express");
const {
  CreateGame,
  JoinGame,
  JoinGameByCode,
  FetchPublicGames,
} = require("../controllers/gameController");
const { route } = require("./auth");

const router = express.Router();

router.post("/create", CreateGame);
router.post("/join", JoinGame);
router.post("/join-by-code", JoinGameByCode);
router.get("/public/:playerCount", FetchPublicGames);

module.exports = router;
