import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Card from "../Card/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GamePage.css";
import { useUser } from "../globalUsername/userContext";
import { useParams } from "react-router-dom";
import OpponentCards from "./OpponentCards";
import RemainingDeck from "./RemainingDeck";
import PlayerCards from "./PlayerCards";
import SideDeck from "./SideDecks";
import TableDeck from "./TableDeck";
import TopDeck from "./TopDeck";

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
      {/* Opponent's Cards for 2 players*/}
      {gameData?.players?.length === 2 && (
        <OpponentCards players={gameData.players} socket={socket} />
      )}

      {/* Middle Area */}
      <div className="middle-container">
        <RemainingDeck remainingDeck={gameData?.remainingDeck} />

        <TableDeck tableCards={gameData?.boardState} />

        {/* player's Cards for 4 players*/}
        {gameData?.players?.length === 4 &&
          gameData.players[1] &&
          gameData.players[2] &&
          gameData.players[3] && (
            <>
              <TopDeck playerHand={gameData.players[1]} />
              <SideDeck playerHand={gameData.players[2]} position="left" />
              <SideDeck playerHand={gameData.players[3]} position="right" />
            </>
          )}
      </div>

      {/* Player's Cards */}
      <PlayerCards
        players={gameData?.players}
        socket={socket}
        handleCardClick={handleCardClick}
      />
    </div>
  );
};

export default GamePage;
