const express = require("express");
const {
  LeaderboardFetch,
  MyStats,
} = require("../controllers/LeaderboardController");

const router = express.Router();

router.get("/stats/leaderboard", LeaderboardFetch);
router.get("/stats/my-stats/:username", MyStats);

module.exports = router;
