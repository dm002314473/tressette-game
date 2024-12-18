import React from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

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
        <div className="rules-text">
          <p>Dobrodošli u igru Trešeta! Ovdje su osnovna pravila igre:</p>
          <ul>
            <li>Igra se s 32 karte.</li>
            <li>Cilj igre je osvojiti što više bodova kombinacijama karata.</li>
            <li>Igrači naizmjenično bacaju karte i prikupljaju bodove.</li>
            <li>
              Ukupni pobjednik je igrač s najviše osvojenih bodova na kraju
              igre.
            </li>
          </ul>
          <p>
            Za detaljnija pravila i strategije igre, obratite se uputama ili
            pitajte druge igrače!
          </p>
        </div>
      </div>
    </div>
  );
}

export default RulesPage;
