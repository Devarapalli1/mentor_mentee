import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";

import ProtectedRoute from "./routing/ProtectedRoute";

function App() {
  const [user, setUser] = useState({});

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/register" element={<Register user={user} />} />

        <Route
          path="/login"
          element={<Login user={user} />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user} >
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
