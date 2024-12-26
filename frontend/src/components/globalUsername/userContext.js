import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier use
export const useUser = () => {
  return useContext(UserContext);
};
