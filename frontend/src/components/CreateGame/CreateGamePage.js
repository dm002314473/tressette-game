import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGamePage.css";

function CreateGamePage() {
  const [playerCount, setPlayerCount] = useState(null);
  const [gameType, setGameType] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main-menu");
  };

  const handlePlayerCountClick = (count) => {
    setPlayerCount(count);
  };

  const handleGameTypeClick = (type) => {
    setGameType(type);
  };

  const handleCreateGameClick = () => {
    console.log("New Game Created");
    // TODO
    // create api call to backend to create a new game
  };

  return (
    <div className="options-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="options-content">
        <h1 className="main-title">Stvori igru</h1>
        <div className="options-block">
          <p className="options-title">Odaberite broj igrača:</p>
          <div className="options-buttons">
            <button
              className={`options-button ${playerCount === 2 ? "active" : ""}`}
              onClick={() => handlePlayerCountClick(2)}
            >
              2
            </button>
            <button
              className={`options-button ${playerCount === 4 ? "active" : ""}`}
              onClick={() => handlePlayerCountClick(4)}
            >
              4
            </button>
          </div>
        </div>

        <div className="options-block">
          <p className="options-title">Odaberite tip igre:</p>
          <div className="options-buttons">
            <button
              className={`options-button ${
                gameType === "Javna" ? "active" : ""
              }`}
              onClick={() => handleGameTypeClick("Javna")}
            >
              Javna
            </button>
            <button
              className={`options-button ${
                gameType === "Privatna" ? "active" : ""
              }`}
              onClick={() => handleGameTypeClick("Privatna")}
            >
              Privatna
            </button>
          </div>
        </div>
      </div>
      <button
        className="create-game-button"
        onClick={() => handleCreateGameClick()}
      >
        Stvori igru
      </button>
    </div>
  );
}

export default CreateGamePage;
