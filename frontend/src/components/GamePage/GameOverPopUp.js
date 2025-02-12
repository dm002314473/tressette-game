import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GameOverPopUp.css";

const EndGamePopUp = ({ flag, yourPoints, opponentPoints }) => {
  if (!flag) return null;

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
        <button className="close-btn" onClick={() => window.location.reload()}>
          Play Again
        </button>
        <button className="close-btn" onClick={() => window.location.reload()}>
          Exit
        </button>
      </div>
    </div>
  );
};

export default EndGamePopUp;
