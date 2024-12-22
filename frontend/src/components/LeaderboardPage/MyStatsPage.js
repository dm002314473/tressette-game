import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardPage.css";
import { useUser } from "../globalUsername/userContext";

function MyStatsPage() {
  const { username } = useUser();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/stats");
  };

  return (
    <div className="leaderboard-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="leaderboard-content">
        <h1 className="main-title">Moja statistika</h1>
        <div className="leaderboard-stats">
          <div className="stat-block">Ime igrača</div>
          <div className="stat-block">Broj pobjeda ukupno</div>
          <div className="stat-block">Broj pobjeda 1v1</div>
          <div className="stat-block">Broj pobjeda 2v2</div>
          <div className="stat-block">Postotak pobjeda</div>
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
    </div>
  );
}

export default MyStatsPage;
