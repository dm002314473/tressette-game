import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";
import "./GamePage.css";

const SideDeck = ({ player, position }) => {
  return (
    <div className={`side-deck ${position}`}>
      <strong>{player?.username}</strong>
      <div className="opponent-hand">
        {player?.hand?.map((card, index) => (
          <Card key={index} card={card} index={index} isYourCard={false} />
        ))}
      </div>
    </div>
  );
};

export default SideDeck;
