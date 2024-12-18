import React, { useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/LoginPage";
import RegistrationPage from "./components/Login/RegistrationPage";
import MainMenuPage from "./components/MainMenu/MainMenuPage";
import JoinGamePage from "./components/JoinGame/JoinGame";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hello")
      .catch((error) => console.error("There was an error!", error));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/main-menu" element={<MainMenuPage />} />
        <Route path="/main-menu/join-game" element={<JoinGamePage />} />
      </Routes>
    </div>
  );
}
export default App;
