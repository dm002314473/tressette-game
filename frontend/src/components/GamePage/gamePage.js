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
  const { userData } = useUser();
  console.log(`username: ${userData.user} userId: ${userData.id}`);
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
      {/* Opponent's Cards for 2 players game*/}
      {gameData?.players?.length === 2 && (
        <div className="opponent-cards">
          {gameData?.players
            ?.filter((player) => socket.id !== player.socketId)
            .map((player, playerIndex) => (
              <div key={player.userId || playerIndex} className="opponent">
                <strong>{player.username}</strong>
                <div className="opponent-hand">
                  {cardsGameData?.hands[playerIndex]?.map((card, index) => (
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
          {cardsGameData?.remainingDeck?.map((card, index) => (
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
              {gameData.players[1]?.hand.map((card, index) => (
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
            return cardsGameData?.hands[playerIndex]?.map((card, index) => (
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
