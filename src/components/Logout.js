import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = ({ setUser }) => {
  useEffect(() => {
    setUser({});
    localStorage.removeItem("mentor-mentee-user");
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;
