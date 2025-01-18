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
  const { userData } = useUser();
  console.log(`username: ${userData?.user} userId: ${userData?.id}`);
  const [currentMessage, setCurrentMessage] = useState("");
  const [cardsGameData, setCardsGameData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [playersInGame, setPlayersInGame] = useState(null);

  const sendMessage = async () => {
    //novo nema currentMessage
    await socket.emit("sendMessage", id);
  };

  useEffect(() => {
    socket.emit("joinGame", id, userData);

    socket.on("receiveMessage", (cardsData, gameData) => {
      console.log("received: ", cardsData);
      console.log("socket.id: ", socket.id);
      setCardsGameData(cardsData);
      setGameData(gameData);
      createPlayersInGameArray(gameData);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [id]);

  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
  };

  const createPlayersInGameArray = (gameData) => {
    let array = [];
    if (gameData?.players) {
      gameData.players.forEach((element) => {
        array.push(element);
      });
    }
    setPlayersInGame(array);
    console.log("players in game: ", array);
  };

  return (
    <div className="container">
      <button class="btn btn-secondary btn-lg" onClick={sendMessage}>
        send
      </button>
      {/* Opponent's Cards for 2 players*/}
      {gameData?.players?.length === 2 && (
        <OpponentCards
          players={gameData.players}
          socket={socket}
          hands={cardsGameData?.hands}
        />
      )}

      {/* Middle Area */}
      <div className="middle-container">
        <RemainingDeck remainingDeck={cardsGameData?.remainingDeck} />

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
        hands={cardsGameData?.hands}
        handleCardClick={handleCardClick}
      />
    </div>
  );
};

export default GamePage;
