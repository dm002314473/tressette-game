import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenuPage.css";

function MainMenuPage() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/");
  };

  const handleCreateGame = () => {
    navigate("/create-game");
  };

  const handleRules = () => {
    navigate("/rules");
  };

  const handleStats = () => {
    navigate("/stats");
  };

  return (
    <div className="menu-container">
      <button className="exit-button" onClick={handleExit}>
        Izlaz
      </button>
      <div className="menu-content">
        <h1 className="menu-title">Trešeta</h1>
        <ul className="menu-options">
          <li>
            <button className="menu-button" onClick={handleCreateGame}>
              Stvori igru
            </button>
          </li>
          <li>
            <button className="menu-button">Pridruži se igri</button>
          </li>
          <li>
            <button className="menu-button" onClick={handleRules}>
              Pravila i upute
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={handleStats}>
              Statistike
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainMenuPage;
