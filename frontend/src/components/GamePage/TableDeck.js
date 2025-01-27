import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../Card/Card";

const TableDeck = ({ tableCards }) => {
  return (
    <div className="table-cards">
      {tableCards?.map((card, index) => (
        <Card key={index} card={card} index={index} isYourCard={"onTable"} />
      ))}
    </div>
  );
};

export default TableDeck;
