import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

function RulesPage() {
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main-menu");
  };

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rules");
        if (!response.ok) {
          throw new Error("Failed to fetch rules");
        }
        const data = await response.json();
        setRules(data.rules);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="rules-container">
      <button className="exit-button" onClick={handleBack}>
        Izlaz
      </button>

      <div className="rules-content">
        <h1 className="rules-title">Pravila i upute</h1>
        <div className="rules-text">
          {loading && <p>Učitavanje pravila...</p>}
          {error && <p className="error-message">{error}</p>}
          {rules && <p>{rules}</p>}
        </div>
      </div>
    </div>
  );
}

export default RulesPage;
