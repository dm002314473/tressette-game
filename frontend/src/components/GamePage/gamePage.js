import React, { useEffect, useState } from "react";
import io from "socket.io-client";
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

const socket = io(`${process.env.REACT_APP_BACKEND}`);

const GamePage = () => {
  const { id } = useParams();
  const { userData, setUserData } = useUser();
  const [gameData, setGameData] = useState(null);
  const [tableCards, setTableCards] = useState([]);
  let yourPoints;
  let opponentPoints;

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
    socket.emit("playMove", { card, gameId: id });
  };

  const calculatePoints = (game) => {};

  socket.on("gameOver", (game) => {
    calculatePoints(game);
    console.log("your points: ", yourPoints);
    console.log("opponent points: ", opponentPoints);
  });

  useEffect(() => {
    const handleMovePlayed = (cardPlayed, updatedGame) => {
      setGameData(updatedGame);

      setTableCards((prevTableCards) => [
        ...(prevTableCards || []),
        cardPlayed,
      ]);
    };

    socket.on("movePlayed", handleMovePlayed);

    return () => {
      socket.off("movePlayed", handleMovePlayed);
    };
  }, []);

  useEffect(() => {
    if (tableCards.length === 2) {
      setTimeout(() => {
        setTableCards([]);
      }, 1500);
    }
  }, [tableCards]);

  return (
    <div className="container">
      {/* Opponent's Cards for 2 players*/}
      {gameData?.type === "2" && <TopDeck />}

      {/* Middle Area */}
      <div className="middle-container">
        <RemainingDeck remainingDeck={gameData?.remainingDeck} />
        <TableDeck tableCards={tableCards} />
        {gameData?.type === "4" && (
          <>
            <TopDeck />
            <SideDeck position="left" />
            <SideDeck position="right" />
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
