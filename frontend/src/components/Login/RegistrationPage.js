import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useUser } from "../globalUsername/userContext";

function RegistrationPage() {
  const { setUsername: saveUsername } = useUser();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        email: email,
        username: username,
        password: password,
        stats: {
          totalWins: 0,
          win1v1: 0,
          win2v2: 0,
          winPercentage: 0,
          played: 0,
        },
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Register successful:", data);
        saveUsername(username);
        navigate("/main-menu");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
        setErrorMessage("Register failed. Please try again.");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error occurred during register:", error);
      setErrorMessage("Register failed. Please try again later.");
      setShowPopup(true);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="Login">
      {" "}
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <span className="SignUp" onClick={handleLogin}>
          Login here
        </span>
      </p>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{errorMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationPage;
