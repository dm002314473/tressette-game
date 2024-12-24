import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";

function Game2v2() {
  return (
    <div className="game-container">
      <button className="exit-button">Izlaz</button>
      <button className="help-button">Pomoć</button>

      <div className="player-cards player3">player3 karte naopako</div>
      <div className="player-cards player2">player2 karte naopako</div>
      <div className="player-cards player4">player4 karte naopako</div>

      <div className="table-cards">karte na stolu</div>

      <div className="score opponent-score">Protivnicki punti naopako</div>
      <div className="score my-score">Moji punti naopako</div>

      <div className="action-buttons">
        <button className="action-btn">Tučem</button>
        <button className="action-btn">Strišo</button>
      </div>

      <div className="my-cards">Moje karte face up</div>
    </div>
  );
}

export default Game2v2;
