import React, { useState, useEffect } from "react";

function JoinGame() {
  const [joinCode, setJoinCode] = useState("");
  const [isPublicGame, setIsPublicGame] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (isPublicGame) {
      const mockGames = [
        { id: 1, name: "Public Game 1", players: 2 },
        { id: 2, name: "Public Game 2", players: 4 },
        { id: 3, name: "Public Game 3", players: 2 },
        { id: 4, name: "Public Game 4", players: 4 },
      ];
      const filteredGames = mockGames.filter(
        (game) => game.players === playerCount
      );
      setGameList(filteredGames);
    } else {
      setGameList([]);
    }
  }, [isPublicGame, playerCount]);

  const handleJoinGame = () => {
    if (isPublicGame) {
      if (selectedGame) {
        console.log(`Joining public game with ${playerCount} players`);
      } else {
        alert("Molimo odaberite igru prije pridruživanja.");
      }
    } else {
      console.log(`Joining game with code: ${joinCode}`);
    }
  };

  return (
    <div className="JoinGame">
      <h2>Pridruži se igri</h2>
      <div>
        <label htmlFor="join-code">Pridruži se s kodom: </label>
        <input
          id="join-code"
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Unesi kod"
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isPublicGame}
            onChange={(e) => setIsPublicGame(e.target.checked)}
          />
          Pridruži se javnoj igri
        </label>
        {isPublicGame && (
          <div>
            <label htmlFor="player-count">Broj igrača</label>
            <select
              id="player-count"
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
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
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    margin: "5px 0",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor:
                      selectedGame?.id === game.id ? "#007BFF" : "#fff",
                    color: selectedGame?.id === game.id ? "#fff" : "#000",
                    textAlign: "center",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
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
      <button onClick={handleJoinGame}>Pridruži se</button>
    </div>
  );
}

export default JoinGame;
