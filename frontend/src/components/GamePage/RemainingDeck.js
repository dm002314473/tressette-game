import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";

const RemainingDeck = ({ remainingDeck }) => {
  return (
    <div className="remaining-deck">
      {remainingDeck?.map((card, index) => (
        <Card key={index} card={card} index={index} isYourCard={false} />
      ))}
    </div>
  );
};

export default RemainingDeck;
