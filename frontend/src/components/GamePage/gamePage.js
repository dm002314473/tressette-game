import React, { useEffect, useState } from "react";
import io from "socket.io-client";
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
    await socket.emit("sendMessage", id);
  };

  useEffect(() => {
    socket.emit("joinGame", id);

    socket.on("receiveMessage", (cardsData, gameData) => {
      console.log("received: ", cardsData);
      console.log("socket.id: ", socket.id);
      setCardsGameData(cardsData);
      setGameData(gameData);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [id]);

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
          return (
            <div key={player.userId || playerIndex}>
              {cardsGameData?.hands[playerIndex]?.map((card, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  {socket.id === card.playerId ? (
                    <p>
                      <strong>Card {index + 1}:</strong> {card.value} of{" "}
                      {card.suit}
                      <br />
                      <strong>Points:</strong> {card.points}
                      <br />
                      <strong>True Value:</strong> {card.trueValue}
                      <br />
                      <strong>Player ID:</strong> {card.playerId}
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div>
        {gameData?.players?.map((player, playerIndex) => {
          return (
            <div key={player.userId || playerIndex}>
              {socket.id !== player.socketId ? (
                <p>
                  <strong>player {player.username}</strong>
                </p>
              ) : (
                <p></p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h2>Remaining deck</h2>
        {cardsGameData?.remainingDeck?.map((card, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p>
              <strong>Card {index + 1}:</strong> {card.value} of {card.suit}
              <br />
              <strong>Points:</strong> {card.points}
              <br />
              <strong>True Value:</strong> {card.trueValue}
              <br />
              <strong>Player ID:</strong> {card.playerId}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
