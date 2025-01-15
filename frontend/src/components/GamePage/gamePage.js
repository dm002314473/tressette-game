import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const GamePage = () => {
  const { id } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = async () => {
    //novo nema currentMessage
    await socket.emit("sendMessage", id);
  };

  useEffect(() => {
    socket.emit("joinGame", id);

    socket.on("receiveMessage", (data) => {
      console.log("received: ", data);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [id]);

  return (
    <div>
      <h1>Game Page</h1>
      <p>
        <input
          type="text"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>send</button>
      </p>
    </div>
  );
};

export default GamePage;
