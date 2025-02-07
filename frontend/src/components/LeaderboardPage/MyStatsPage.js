import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardPage.css";
import { useUser } from "../globalUsername/userContext";

function MyStatsPage() {
  const { userData } = useUser();
  console.log(userData);
  const [playerToFind, setPlayerToFind] = useState({
    username: userData.user,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [stats, setStats] = useState({
    totalWins: 0,
    oneVsOneWins: 0,
    twoVsTwoWins: 0,
    winPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/stats");
  };

  useEffect(() => {
    const fetchMyStats = async () => {
      if (!userData.user) return;
      try {
        setLoading(true);
        setError(null);
        console.log("Username:", userData.user);

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}api/leaderboard/stats/my-stats/${userData.user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response data:", response.data);

        if (response.ok) {
          const playerData = await response.json();
          setPlayerToFind(playerData);
        } else {
          const errorData = await response.json();
          console.error("data fetch failed:", errorData);
          setErrorMessage("Please try again.");
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error occurred during fetching:", error);
        setErrorMessage("Please try again later.");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStats();
  }, [userData.user]);

  useEffect(() => {
    const username = userData.user;
    setPlayerToFind({ username });
  }, [userData.user]);

  return (
    <div className="leaderboard-container">
      <button className="exit-button" onClick={handleBack}>
        Natrag
      </button>

      <div className="leaderboard-content">
        <h1 className="main-title">Moja statistika</h1>
        <div className="username-block">
          <h2>{playerToFind.username}</h2>
        </div>
        {loading ? (
          <p className="loading-message">Učitavanje podataka...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="leaderboard-stats">
            <div className="stat-block">
              Broj pobjeda ukupno: {playerToFind.stats?.totalWins}
            </div>
            <div className="stat-block">
              Broj pobjeda 1v1: {playerToFind.stats?.win1v1}
            </div>
            <div className="stat-block">
              Broj pobjeda 2v2: {playerToFind.stats?.win2v2}
            </div>
            <div className="stat-block">
              Postotak pobjeda: {playerToFind.stats?.winPercentage}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyStatsPage;
