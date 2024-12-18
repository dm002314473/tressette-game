import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        email: email,
        username: username,
        password: password,
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
      } else {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
      }
    } catch (error) {
      console.error("Error occurred during register:", error);
    }
  };

  const handleLogin = () => {
    navigate("/");
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
    </div>
  );
}

export default RegistrationPage;
