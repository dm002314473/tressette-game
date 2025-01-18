import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";

const OpponentCards = ({ players, socket, hands }) => {
  return (
    <div className="opponent-cards">
      {players
        ?.filter((player) => socket.id !== player.socketId)
        .map((player, playerIndex) => (
          <div key={player.userId || playerIndex} className="opponent">
            <strong>{player.username}</strong>
            <div className="opponent-hand">
              {hands[playerIndex]?.map((card, index) => (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isYourCard={false}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OpponentCards;
