import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";

function Game1v1() {
  return (
    <div className="game-container">
      <button className="exit-button">Izlaz</button>
      <button className="help-button">Pomoć</button>

      <div className="player-cards player3">Protivničke karte</div>

      <div className="table-cards">karte na stolu</div>

      <div className="score opponent-score">Protivnički punti</div>
      <div className="score my-score">Moji punti</div>

      <div className="action-buttons">
        <button className="action-btn">Tučem</button>
        <button className="action-btn">Strišo</button>
      </div>

      <div className="my-cards">Moje karte</div>
    </div>
  );
}

export default Game1v1;
