import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Card from "../Card/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GamePage.css";
import { useUser } from "../globalUsername/userContext";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const GamePage = () => {
  const { id } = useParams();
  const { userData, setUserData } = useUser();
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (!userData && storedUserData) {
      setUserData(storedUserData);
    }
  }, [userData, setUserData]);

  useEffect(() => {
    socket.emit("joinGame", id, userData);

    socket.on("startGame", (gameData) => {
      console.log("received: ", gameData);
      console.log("socket.id: ", socket.id);
      setGameData(gameData);
    });

    return () => {
      socket.off("startGame");
    };
  }, [id]);

  const handleCardClick = (card) => {
    console.log("Card clicked:", card, id);
    socket.emit("playMove", { card, gameId: id });
  };

  socket.on("roundEnded", (updatedGameState) => {
    setGameData(updatedGameState);
    console.log("Round ended, new game state: ", updatedGameState);
  });

  return (
    <div className="container">
      {/* Opponent's Cards for 2 players game*/}
      {gameData?.players?.length === 2 && (
        <div className="opponent-cards">
          {gameData?.players
            ?.filter((player) => socket.id !== player.socketId)
            .map((player, playerIndex) => (
              <div key={player.userId || playerIndex} className="opponent">
                <strong>{player.username}</strong>
                <div className="opponent-hand">
                  {gameData.players[playerIndex]?.hand?.map((card, index) => (
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
      )}

      {/* Middle Area */}
      <div className="middle-container">
        {/* Remaining Deck */}
        <div className="remaining-deck">
          {gameData?.remainingDeck?.map((card, index) => (
            <Card key={index} card={card} index={index} isYourCard={false} />
          ))}
        </div>

        {/* Table Cards
        <div className="table-cards">
          {tableCards?.map((card, index) => (
            <Card key={index} card={card} index={index} isYourCard={false} />
          ))}
        </div> */}

        {/* Side Decks for 4 Players */}
        {gameData?.players?.length === 4 && (
          <>
            <div className="side-deck left">
              {gameData.players[0]?.hand.map((card, index) => (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isYourCard={false}
                />
              ))}
            </div>
            <div className="side-deck right">
              {gameData.players[3]?.hand.map((card, index) => (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isYourCard={false}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Player's Cards */}
      <div className="player-cards">
        {gameData?.players?.map((player, playerIndex) => {
          if (socket.id === player.socketId) {
            return gameData.players[playerIndex]?.hand?.map((card, index) => (
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
    </div>
  );
};

export default GamePage;
