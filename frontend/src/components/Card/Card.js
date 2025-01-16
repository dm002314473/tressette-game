import React from "react";
import "./Card.css";

const Card = ({ card, index, isYourCard, onClick }) => {
  return (
    <div
      className={`card ${isYourCard ? "your-card" : "opponent-card"}`}
      onClick={() => onClick && onClick(card)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick && onClick(card)}
    >
      {isYourCard ? (
        <>
          <p>
            {card.value} of {card.suit}
          </p>
        </>
      ) : (
        <p className="hidden-card"></p>
      )}
    </div>
  );
};

export default Card;
