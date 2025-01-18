import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";

const TopDeck = ({ player }) => {
  return (
    <div className="opponent">
      <strong>{player?.username}</strong>
      <div className="opponent-hand">
        {player?.hand?.map((card, index) => (
          <Card key={index} card={card} index={index} isYourCard={false} />
        ))}
      </div>
    </div>
  );
};

export default TopDeck;
