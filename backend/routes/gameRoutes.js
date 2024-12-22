const express = require("express");
const { CreateGame, JoinGame } = require("../controllers/gameController");
const { route } = require("./auth");

const router = express.Router();

router.post("/create", CreateGame);
router.post("/join", JoinGame);

module.exports = router;
