import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";
import "./GamePage.css";

const SideDeck = ({ position }) => {
  const cards = Array(10).fill(null); // Array of 10 cards

  return (
    <div className={`side-deck ${position}`}>
      {cards.map((_, index) => (
        <Card key={index} isYourCard={false} />
      ))}
    </div>
  );
};

export default SideDeck;
