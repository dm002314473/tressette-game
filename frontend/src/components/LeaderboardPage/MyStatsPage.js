import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardPage.css";
import { useUser } from "../globalUsername/userContext";

function MyStatsPage() {
  const { username } = useUser();
  const [stats, setStats] = useState({
    totalWins: 0,
    oneVsOneWins: 0,
    twoVsTwoWins: 0,
    winPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/stats");
  };

  const fetchMyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://localhost:5000/api/leaderboard/stats/my-stats"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch your statistics.");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStats();
  }, []);

  return (
    <div className="leaderboard-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="leaderboard-content">
        <h1 className="main-title">Moja statistika</h1>
        {loading ? (
          <p className="loading-message">Učitavanje podataka...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="leaderboard-stats">
            <div className="stat-block">Broj pobjeda ukupno:</div>
            <div className="stat-block">Broj pobjeda 1v1:</div>
            <div className="stat-block">Broj pobjeda 2v2:</div>
            <div className="stat-block">Postotak pobjeda: %</div>
          </div>
        )}
      </div>
      <div className="leaderboard-my-stats">
        <div className="player-row">
          <div className="player-stat">{username}</div>
          <div className="player-stat">12</div>
          <div className="player-stat">5</div>
          <div className="player-stat">7</div>
          <div className="player-stat">64%</div>
        </div>
      </div>
    </div>
  );
}

export default MyStatsPage;
