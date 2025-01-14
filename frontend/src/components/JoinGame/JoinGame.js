import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./JoinGame.css";
import { useUser } from "../globalUsername/userContext";

const socket = io.connect("http://localhost:5000");

function JoinGame() {
  const { userData } = useUser();
  console.log(userData);

  const [joinCode, setJoinCode] = useState("");
  const [isPublicGame, setIsPublicGame] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameList, setGameList] = useState({});

  const navigate = useNavigate();

  const handleNumberOfPlayersClick = (count) => {
    setPlayerCount(count);
  };

  useEffect(() => {
    if (isPublicGame) {
      const fetchPublicGames = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/games/public/${playerCount}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch public games");
          }
          const data = await response.json();
          setGameList(data);
          console.log("data: ", data);
        } catch (error) {
          console.error("Error fetching public games:", error);
          setGameList({});
        }
      };

      fetchPublicGames();
    } else {
      setGameList({});
    }
  }, [isPublicGame, playerCount]);

  const handleJoinGame = async () => {
    try {
      if (isPublicGame) {
        console.log("gamelist id: ", gameList._id);
        console.log("user id: ", userData.id);
        console.log("gameList: ", gameList);
        if (gameList) {
          const response = await fetch(`http://localhost:5000/api/games/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameId: gameList._id,
              userId: userData.id,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to join public game");
          }
          alert(`Successfully joined public game`);

          //emit joinGame event
          if (userData !== "" && gameList._id !== "") {
            socket.emit("joinGame", userData, gameList._id);
          }

          setTimeout(() => {
            navigate("/game/" + gameList._id);
          }, 1500);
        }
      } else {
        // API GET: http://localhost:5000/api/games/join-by-code
        console.log({ gameCode: joinCode, userId: userData.id });
        const response = await fetch(
          `http://localhost:5000/api/games/join-by-code`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameCode: joinCode, userId: userData.id }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to join private game");
        }
        alert("Successfully joined the private game");

        const data = await response.json();

        //emit joinGame event
        if (userData !== "" && data.gameId !== "") {
          socket.emit("joinGame", userData, data.gameId);
        }

        console.log("response data", data.gameId);
        setTimeout(() => {
          navigate("/game/" + data.gameId);
        }, 1500);
      }
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Nema dostupne igre.");
    }
  };

  return (
    <div className="JoinGame-container">
      <button className="back-button" onClick={() => navigate("/main-menu")}>
        Natrag
      </button>
      <h1>Pridruži se igri</h1>
      <div className="JoinGame-content">
        <div>
          <label htmlFor="join-code" className="style-text">
            Pridruži se s kodom:{" "}
          </label>
          <input
            id="join-code"
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Unesi kod"
          />
        </div>
        <div>
          <label className="style-text">
            <input
              type="checkbox"
              checked={isPublicGame}
              onChange={(e) => setIsPublicGame(e.target.checked)}
            />
            Pridruži se javnoj igri
          </label>
          {isPublicGame && (
            <div>
              <span className="style-text">Broj igrača</span>
              <div className="button-container">
                <button
                  className={`player-count-button ${
                    playerCount === 2 ? "active" : ""
                  }`}
                  onClick={() => handleNumberOfPlayersClick(2)}
                >
                  2
                </button>
                <button
                  className={`player-count-button ${
                    playerCount === 4 ? "active" : ""
                  }`}
                  onClick={() => handleNumberOfPlayersClick(4)}
                >
                  4
                </button>
              </div>
            </div>
          )}
        </div>
        {isPublicGame && (
          <div>
            {gameList ? console.log("") : <li>Nema dostupnih igara</li>}
          </div>
        )}
        <button className="join-button" onClick={handleJoinGame}>
          Pridruži se
        </button>
      </div>
    </div>
  );
}

export default JoinGame;
