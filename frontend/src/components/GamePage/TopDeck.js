import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";

const TopDeck = () => {
  const cards = Array(10).fill(null); // Array of 10 cards

  return (
    <div className="opponent-cards">
      {cards.map((_, index) => (
        <Card key={index} isYourCard={"false"} />
      ))}
    </div>
  );
};

export default TopDeck;
