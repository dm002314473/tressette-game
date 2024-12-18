import React from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGamePage.css";

function CreateGamePage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main-menu");
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
            <button className="options-button">2</button>
            <button className="options-button">4</button>
          </div>
        </div>

        <div className="options-block">
          <p className="options-title">Odaberite tip igre:</p>
          <div className="options-buttons">
            <button className="options-button">Javna</button>
            <button className="options-button">Privatna</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGamePage;
