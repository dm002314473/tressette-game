import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState("stats.totalWins");

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("stats.winPercentage");
  const [sortOrder, setSortOrder] = useState(-1);

  const [selectedCategory, setSelectedCategory] = useState(
    "ukupnom postotku pobjeda"
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:5000/api/leaderboard/stats/leaderboard?sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy, sortOrder]);

  const handleSortChange = (field, order, category) => {
    setSelectedButton(field);
    setSortBy(field);
    setSortOrder(order);
    setSelectedCategory(category);
  };

  const handleBack = () => {
    navigate("/stats");
  };

  return (
    <div className="leaderboard-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="leaderboard-content">
        <h1 className="main-title">Ljestvica</h1>
        <div className="leaderboard-stats">
          <button
            className={`stat-button ${
              selectedButton === "stats.totalWins" ? "selected" : ""
            }`}
            onClick={() =>
              handleSortChange("stats.totalWins", -1, "ukupnom broju pobjeda")
            }
          >
            Broj pobjeda ukupno
          </button>
          <button
            className={`stat-button ${
              selectedButton === "stats.win1v1" ? "selected" : ""
            }`}
            onClick={() =>
              handleSortChange("stats.win1v1", -1, "pobjedama 1v1")
            }
          >
            Broj pobjeda 1v1
          </button>
          <button
            className={`stat-button ${
              selectedButton === "stats.win2v2" ? "selected" : ""
            }`}
            onClick={() =>
              handleSortChange("stats.win2v2", -1, "pobjedama 2v2")
            }
          >
            Broj pobjeda 2v2
          </button>
          <button
            className={`stat-button ${
              selectedButton === "stats.winPercentage" ? "selected" : ""
            }`}
            onClick={() =>
              handleSortChange(
                "stats.winPercentage",
                -1,
                "ukupnom postotku pobjeda"
              )
            }
          >
            Postotak pobjeda
          </button>
        </div>

        <div className="leaderboard-players">
          <h2 className="sub-title">
            Top 10 igrača po <span>{selectedCategory}</span>
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            players.map((player, index) => (
              <div key={player._id} className="player-row">
                {index + 1}. {player.username} - {get(player, sortBy, 0)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
