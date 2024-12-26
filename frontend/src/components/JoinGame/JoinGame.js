import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinGame.css";

function JoinGame() {
  const [joinCode, setJoinCode] = useState("");
  const [isPublicGame, setIsPublicGame] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
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
          // API call for getting public games by selected playerCount
          // GET http://localhost:5000/api/games?playerCount=${playerCount}
          const response = await fetch(`/api/games?playerCount=${playerCount}`);
          if (!response.ok) {
            throw new Error("Failed to fetch public games");
          }
          const data = await response.json();
          setGameList(data);
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
        if (selectedGame) {
          // API GET: http://localhost:5000/api/games/join
          const response = await fetch(`/api/games/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId: selectedGame.id }),
          });
          if (!response.ok) {
            throw new Error("Failed to join public game");
          }
          alert(`Successfully joined public game: ${selectedGame.name}`);
        } else {
          alert("Molimo odaberite igru prije pridruživanja.");
        }
      } else {
        // API GET: http://localhost:5000/api/games/join-by-code
        const response = await fetch(`/api/games/join-by-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: joinCode }),
        });
        if (!response.ok) {
          throw new Error("Failed to join private game");
        }
        alert("Successfully joined the private game");
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
            <h3>Lista dostupnih igara</h3>
            <ul>
              {gameList.length > 0 ? (
                gameList.map((game) => (
                  <li
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className={selectedGame?.id === game.id ? "selected" : ""}
                  >
                    {game.name} - {game.players} igrača
                  </li>
                ))
              ) : (
                <li>Nema dostupnih igara</li>
              )}
            </ul>
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
