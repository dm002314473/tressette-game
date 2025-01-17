import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Card from "../Card/Card";
import "./GamePage.css";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const GamePage = () => {
  const { id } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const [cardsGameData, setCardsGameData] = useState(null);
  const [gameData, setGameData] = useState(null);
  console.log("id na frontu: ", id);

  const sendMessage = async () => {
    //novo nema currentMessage
    //await socket.emit("sendMessage", id);
  };

  useEffect(() => {
    socket.emit("joinGame", id);

    socket.on("startGame", (cardsData, gameData) => {
      console.log("received: ", cardsData);
      console.log("socket.id: ", socket.id);
      setCardsGameData(cardsData);
      setGameData(gameData);
    });

    return () => {
      socket.off("startGame");
    };
  }, [id]);

  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
    socket.emit("playMove", { card, gameId: id });
  };

  socket.on("roundEnded", (updatedGameState) => {
    setGameData(updatedGameState);
    console.log("Round ended, new game state: ", updatedGameState);
  });

  return (
    <div>
      <h1>Game Page</h1>
      <p>
        <input
          type="text"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>send</button>
      </p>
      <div>
        <h1>Game Details</h1>
        {gameData?.joinCode && (
          <p>
            <strong>Join Code:</strong> {gameData?.joinCode}
          </p>
        )}
      </div>

      <div>
        <h2>Your Deck</h2>
        {gameData?.players?.map((player, playerIndex) => {
          if (socket.id === player.socketId) {
            return (
              <div key={player.userId || playerIndex} className="player-cards">
                {cardsGameData?.hands[playerIndex]?.map((card, index) => (
                  <Card
                    key={index}
                    card={card}
                    index={index}
                    isYourCard={true}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      <div>
        {gameData?.players?.map((player, playerIndex) => {
          return (
            <div key={player.userId || playerIndex}>
              {socket.id !== player.socketId ? (
                <div
                  key={player.userId || playerIndex}
                  className="player-cards"
                >
                  <strong>player {player.username}</strong>
                  {cardsGameData?.hands[playerIndex]?.map((card, index) => (
                    <Card
                      key={index}
                      card={card}
                      index={index}
                      isYourCard={false}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              ) : (
                <p></p>
              )}
            </div>
          );
        })}
      </div>

      <h2>Remaining deck</h2>
      <div className="remaining-deck">
        {cardsGameData?.remainingDeck?.map((card, index) => (
          <Card
            key={index}
            card={card}
            index={index}
            isYourCard={false}
            onClick={handleCardClick}
            className="card"
          />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
