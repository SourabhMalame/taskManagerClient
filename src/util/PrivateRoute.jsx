// src/util/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for token in local storage

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no valid token
  }

  return children; // Render children if token is valid
};

export default PrivateRoute;
