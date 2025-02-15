import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GameOverPopUp.css";

const EndGamePopUp = ({ flag, yourPoints, opponentPoints }) => {
  const navigate = useNavigate();

  if (!flag) return null;

  const handleExitButtonClick = () => {
    navigate("/main-menu");
  };

  const resultMessage =
    yourPoints > opponentPoints
      ? "🎉 Pobijedili ste! 🎉"
      : "😢 Izgubili ste! 😢";

  return (
    <div className="end-screen">
      <div className="popup-container">
        <h2 className="game-result">{resultMessage}</h2>
        <p className="points">
          Tvoji punti: <span>{yourPoints}</span>
        </p>
        <p className="points">
          Suparnički punti: <span>{opponentPoints}</span>
        </p>
        <button className="close-btn" onClick={() => handleExitButtonClick()}>
          Izlaz
        </button>
      </div>
    </div>
  );
};

export default EndGamePopUp;
