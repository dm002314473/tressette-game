import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  const [leaderboards, setLeaderboards] = useState({
    totalWins: [],
    oneVsOneWins: [],
    twoVsTwoWins: [],
    winPercentage: [],
  });
  const [activeCategory, setActiveCategory] = useState("totalWins");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/stats");
  };

  const fetchLeaderboard = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5000/api/leaderboard/${category}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      setLeaderboards((prev) => ({ ...prev, [category]: data }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeCategory);
  }, [activeCategory]);

  const renderLeaderboard = () => {
    if (loading) return <p>Učitavanje ljestvice...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
      <div className="leaderboard-players">
        {leaderboards[activeCategory].map((player, index) => (
          <div key={index} className="player-row">
            {index + 1}. {player.name} - {player.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="leaderboard-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="leaderboard-content">
        <h1 className="main-title">Ljestvica</h1>

        <div className="category-buttons">
          <button onClick={() => setActiveCategory("totalWins")}>
            Ukupne pobjede
          </button>
          <button onClick={() => setActiveCategory("oneVsOneWins")}>
            Pobjede 1v1
          </button>
          <button onClick={() => setActiveCategory("twoVsTwoWins")}>
            Pobjede 2v2
          </button>
          <button onClick={() => setActiveCategory("winPercentage")}>
            Postotak pobjeda
          </button>
        </div>
        {renderLeaderboard()}
      </div>
    </div>
  );
}

export default LeaderboardPage;
