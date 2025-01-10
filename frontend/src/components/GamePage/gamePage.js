import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000"); // Adjust to match your backend server URL

const GamePage = () => {
  const { id } = useParams();
  const [currentGame, setCurrentGame] = useState(null);

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    // Connection confirmation
    socket.on("connect", () => {
      console.log("Connected to server");
      setMessage("Connected to game server");
      socket.emit("joinGame", id, { userId: localStorage.getItem("userId") });
    });

    // Listen for game updates when a player joins
    socket.on("gameUpdated", (game) => {
      setCurrentGame(game);
      console.log("Game updated:", game);
    });

    // Listen for game start response
    socket.on("gameStarted", (data) => {
      const { hand, remainingDeck, game } = data;
      setCurrentGame(game); // Update game state without players' hands

      console.log("Your hand:", hand);

      setResponse(
        `Your hand: ${JSON.stringify(hand)} Table deck: ${JSON.stringify(
          remainingDeck
        )}`
      );
    });

    socket.on("message", (data) => {
      setResponse(data);
    });

    // Clean up connection on unmount
    return () => {
      socket.disconnect();
    };
  }, [id]);

  const startGame = () => {
    socket.emit("startGame", id); // Send only the gameId directly
    setMessage("Game started, waiting for response...");
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1>Game Page</h1>
      <p>{message}</p>
      {currentGame?.status === "active" ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <p>
          Not all players have joined the game yet
          <button onClick={refreshPage}>Check for players</button>
        </p>
      )}
      <p>Server Response: {response}</p>
    </div>
  );
};

export default GamePage;
