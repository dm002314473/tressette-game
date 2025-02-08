import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import "./CreateGamePage.css";
import { useUser } from "../globalUsername/userContext";

const socket = io.connect(`${process.env.REACT_APP_BACKEND}`);

function CreateGamePage() {
  const { userData } = useUser();
  console.log("USERDATA: ", userData);

  const [playerCount, setPlayerCount] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main-menu");
  };

  const handlePlayerCountClick = (count) => {
    setPlayerCount(count);
  };

  const handleGameTypeClick = (type) => {
    setGameType(type);
  };

  const handleCreateGameClick = async () => {
    try {
      if (!playerCount || !gameType) {
        setError("Morate odabrati broj igrača i tip igre");
        return;
      }

      const userId = userData.id;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}api/games/create`,
        {
          userId,
          type: playerCount === 2 ? "2" : "4",
          isPrivate: gameType === "Privatna",
        }
      );

      setSuccessMessage("Igra uspješno stvorena");
      console.log("Game created successfully: ", response.data);

      console.log("userData: ", userData);
      //emit joinGame event
      if (userData !== "" && response.data._id !== "") {
        socket.emit("joinGame", userData, response.data._id);
      }

      setTimeout(() => {
        navigate("/game/" + response.data._id);
      }, 1500);
    } catch (error) {
      console.error("Error creating game:", error);
      setError("Došlo je do pogreške pri stvaranju igre.");
    }
  };

  return (
    <div className="options-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="options-content">
        <h1 className="main-title">Stvori igru</h1>
        <div className="options-block">
          <p className="options-title">Odaberite broj igrača:</p>
          <div className="options-buttons">
            <button
              className={`options-button ${playerCount === 2 ? "active" : ""}`}
              onClick={() => handlePlayerCountClick(2)}
            >
              2
            </button>
            <button
              className={`options-button ${playerCount === 4 ? "active" : ""}`}
              onClick={() => handlePlayerCountClick(4)}
            >
              4
            </button>
          </div>
        </div>

        <div className="options-block">
          <p className="options-title">Odaberite tip igre:</p>
          <div className="options-buttons">
            <button
              className={`options-button ${
                gameType === "Javna" ? "active" : ""
              }`}
              onClick={() => handleGameTypeClick("Javna")}
            >
              Javna
            </button>
            <button
              className={`options-button ${
                gameType === "Privatna" ? "active" : ""
              }`}
              onClick={() => handleGameTypeClick("Privatna")}
            >
              Privatna
            </button>
          </div>
        </div>
      </div>
      <button
        className="create-game-button"
        onClick={() => handleCreateGameClick()}
      >
        Stvori igru
      </button>
    </div>
  );
}

export default CreateGamePage;
