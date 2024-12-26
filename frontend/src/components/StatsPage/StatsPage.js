import React from "react";
import { useNavigate } from "react-router-dom";
import "./StatsPage.css";

import { useUser } from "../globalUsername/userContext";

function StatsPage() {
  const { userData } = useUser();
  console.log(userData);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main-menu");
  };

  const handleLeaderboard = () => {
    navigate("/stats/leaderboard");
  };

  const handleMyStats = () => {
    navigate("/stats/my-stats");
  };
  return (
    <div className="options-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="options-content">
        <h1 className="main-title">Statistika</h1>
        <div className="options-buttons">
          <button className="options-button" onClick={handleLeaderboard}>
            Ljestvica
          </button>
          <button className="options-button" onClick={handleMyStats}>
            Moja statistika
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
