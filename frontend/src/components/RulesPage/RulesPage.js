import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

const TRESSETTE_RULES = `
1. Igra je trešeta, pravila su za trešetu.<br />
2. Ako izađete iz partije, gubite.<br />
3. Ako ne odigrate potez u roku od 10 sekundi, gubite.<br />`;

function RulesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main-menu");
  };

  return (
    <div className="rules-container">
      <button className="exit-button" onClick={handleBack}>
        Izlaz
      </button>

      <div className="rules-content">
        <h1 className="rules-title">Pravila i upute</h1>
        <div
          className="rules-text"
          dangerouslySetInnerHTML={{ __html: TRESSETTE_RULES }}
        />
      </div>
    </div>
  );
}

export default RulesPage;
