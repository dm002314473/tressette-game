import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.css";

const Card = ({ card, index, isYourCard, onClick }) => {
  const imagePath = `/CardImages/${card?.value}_${card?.suit}.png`;
  console.log("image path: ", imagePath);

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
          <img src={imagePath} className="card-image" />
        </>
      ) : (
        <p className="font-italic text-muted mb-1"></p>
      )}
    </div>
  );
};

export default Card;
