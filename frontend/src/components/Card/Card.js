import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.css";

const Card = ({ card, index, isYourCard, onClick }) => {
  return (
    <div
      className={`card shadow-sm text-center ${
        isYourCard ? "your-card" : "opponent-card"
      }`}
      onClick={() => onClick && onClick(card)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick && onClick(card)}
    >
      {isYourCard ? (
        <>
          <p className="mb-1">
            {card.value} of {card.suit}
          </p>
        </>
      ) : (
        <p className="font-italic text-muted mb-1"></p>
      )}
    </div>
  );
};

export default Card;
