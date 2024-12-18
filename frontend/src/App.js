import React, { useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/LoginPage";
import RegistrationPage from "./components/Login/RegistrationPage";
import MainMenuPage from "./components/MainMenu/MainMenuPage";

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
      </Routes>
    </div>
  );
}
export default App;
