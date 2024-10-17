import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user }) => {
  return user?.email ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
