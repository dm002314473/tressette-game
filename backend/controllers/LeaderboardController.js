const Users = require("../models/User");

const LeaderboardFetch = async (req, res) => {
  try {
    const sortField = req.query.sortBy || "stats.winPercentage";
    const sortOrder = parseInt(req.query.sortOrder, 10) || -1;

    const sortCriteria = { [sortField]: sortOrder };

    const topUsers = await Users.find({}).sort(sortCriteria).limit(10);
    res.status(200).json(topUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const MyStats = async (req, res) => {
  try {
    const topUsers = await Users.find({})
      .sort({ "stats.winPercentage": -1 })
      .limit(1);
    res.status(200).json(topUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { LeaderboardFetch, MyStats };
