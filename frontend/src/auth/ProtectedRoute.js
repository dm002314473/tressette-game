import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../components/globalUsername/userContext";

const ProtectedRoute = () => {
  const { userData } = useUser();
  return userData ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
