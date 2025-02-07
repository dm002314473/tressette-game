import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useUser } from "../globalUsername/userContext";

function Login() {
  const { setUserData: saveUserData } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        username: username,
        password: password,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data.username, data.id);
        saveUserData(data);
        navigate("/main-menu");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        setErrorMessage("Login failed. Please try again.");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setErrorMessage("Login failed. Please try again later.");
      setShowPopup(true);
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleResetPassword = () => {
    navigate("/reset-password/enter-mail");
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Forgot password?{" "}
        <span className="ForgotPassword" onClick={handleResetPassword}>
          Reset password?
        </span>
      </p>
      <p>
        Don't have an account?{" "}
        <span className="SignUp" onClick={handleSignUp}>
          Sign up?
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

export default Login;
