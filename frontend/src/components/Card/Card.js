import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.css";

const Card = ({ card, index, isYourCard, onClick }) => {
  const imagePath = `/CardImages/${card?.value}_${card?.suit}.png`;

  const cardStyle = () => {
    if (isYourCard === "true") return "your-card";
    else if (isYourCard === "onTable") return "on-table";
    else if (isYourCard === "tableDeck") return "table-deck";
    else return "opponent-card";
  };

  const randomRotation = Math.floor(Math.random() * 11) - 5;

  return (
    <div
      className={`card shadow-sm text-center ${cardStyle()}`}
      onClick={() => onClick && onClick(card)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick && onClick(card)}
      style={{
        transform:
          cardStyle() !== "your-card" ? `rotate(${randomRotation}deg)` : "",
      }}
    >
      {cardStyle() === "your-card" ? (
        <>
          <img src={imagePath} alt="" className="card-image" />
        </>
      ) : (
        <p className="font-italic text-muted mb-1"></p>
      )}
    </div>
  );
};

export default Card;
