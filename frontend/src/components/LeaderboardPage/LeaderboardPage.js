import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardPage.css";

function LeaderboardPage() {
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
        <h1 className="main-title">Ljestvica</h1>
        <div className="leaderboard-stats">
          <div className="stat-block">Broj pobjeda ukupno</div>
          <div className="stat-block">Broj pobjeda 1v1</div>
          <div className="stat-block">Broj pobjeda 2v2</div>
          <div className="stat-block">Postotak pobjeda</div>
        </div>

        <div className="leaderboard-players">
          <h2 className="sub-title">Top 10 igrača:</h2>
          <div className="player-row">1. Igrač Placeholder</div>
          <div className="player-row">2. Igrač Placeholder</div>
          <div className="player-row">3. Igrač Placeholder</div>
          <div className="player-row">4. Igrač Placeholder</div>
          <div className="player-row">5. Igrač Placeholder</div>
          <div className="player-row">6. Igrač Placeholder</div>
          <div className="player-row">7. Igrač Placeholder</div>
          <div className="player-row">8. Igrač Placeholder</div>
          <div className="player-row">9. Igrač Placeholder</div>
          <div className="player-row">10. Igrač Placeholder</div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
