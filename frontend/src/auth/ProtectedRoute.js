import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
