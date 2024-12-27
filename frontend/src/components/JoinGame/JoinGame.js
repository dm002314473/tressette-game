import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinGame.css";
import { useUser } from "../globalUsername/userContext";

// TODO: list public games in JoinGamePage, open /game/id page

function JoinGame() {
  const { userData } = useUser();
  console.log(userData);

  const [joinCode, setJoinCode] = useState("");
  const [isPublicGame, setIsPublicGame] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          console.log(data);
        } catch (error) {
          console.error("Error fetching public games:", error);
          setGameList([]);
        }
      };

      fetchPublicGames();
    } else {
      setGameList([]);
    }
  }, [isPublicGame, playerCount]);

  const handleJoinGame = async () => {
    try {
      if (isPublicGame) {
        console.log("gamelist id: ", gameList[0]._id);
        console.log("user id: ", userData.id);
        if (gameList[0]) {
          // API GET: http://localhost:5000/api/games/join
          const response = await fetch(`http://localhost:5000/api/games/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameId: gameList[0]._id,
              userId: userData.id,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to join public game");
          }
          alert(`Successfully joined public game`);

          setTimeout(() => {
            navigate("/game/" + gameList[0]._id);
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

        // find the right id to navigate to
        setTimeout(() => {
          navigate("/game/" + response.data._id);
        }, 1500);
      }
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Došlo je do pogreške prilikom pridruživanja igri.");
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
            {gameList.length > 0 ? (
              console.log("")
            ) : (
              <li>Nema dostupnih igara</li>
            )}
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
