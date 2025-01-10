import { useState } from "react";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/reset-password/${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Read the raw response
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const data = await response.json();
      if (data.success) {
        alert("Password reset email sent. Please check your inbox.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message || error);
    }
  };

  return (
    <div className="ResetPassword">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ResetPassword;
