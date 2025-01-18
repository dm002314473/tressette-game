import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";

const PlayerCards = ({ players, socket, hands, handleCardClick }) => {
  return (
    <div className="player-cards">
      {players?.map((player, playerIndex) => {
        if (socket.id === player.socketId) {
          return hands[playerIndex]?.map((card, index) => (
            <Card
              key={index}
              card={card}
              index={index}
              isYourCard={true}
              onClick={handleCardClick}
            />
          ));
        }
        return null;
      })}
    </div>
  );
};

export default PlayerCards;
