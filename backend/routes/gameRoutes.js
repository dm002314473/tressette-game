const express = require("express");
const {
  CreateGame,
  JoinGame,
  JoinGameByCode,
} = require("../controllers/gameController");
const { route } = require("./auth");

const router = express.Router();

router.post("/create", CreateGame);
router.post("/join", JoinGame);
router.post("/join-by-code", JoinGameByCode);

module.exports = router;
