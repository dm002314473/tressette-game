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
import GameOverPopUp from "./GameOverPopUp";

const socket = io(`${process.env.REACT_APP_BACKEND}`);

const GamePage = () => {
  const { id } = useParams();
  const { userData, setUserData } = useUser();
  const [gameData, setGameData] = useState(null);
  const [tableCards, setTableCards] = useState([]);
  const [isEndGameVisible, setIsEndGameVisible] = useState(false);
  const [yourPoints, setYourPoints] = useState(0);
  const [opponentPoints, setOpponentPoints] = useState(0);

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

  socket.on("gameOver", (points) => {
    const player1 = points[0].split(" ");
    const player2 = points[1].split(" ");
    if (player1[1] == socket.id) {
      setYourPoints(player1[0]);
      setOpponentPoints(player2[0]);
    } else {
      setYourPoints(player2[0]);
      setOpponentPoints(player1[0]);
    }
    setIsEndGameVisible(true);
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
        <GameOverPopUp
          flag={isEndGameVisible}
          yourPoints={yourPoints}
          opponentPoints={opponentPoints}
        />
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
