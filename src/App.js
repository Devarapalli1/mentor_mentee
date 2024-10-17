import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";

import ProtectedRoute from "./routing/ProtectedRoute";
import Goals from "./components/Goals";
import AddGoal from "./components/AddGoal";

function App() {
  const [user, setUser] = useState({
    email: "dummy@dummy.com",
    name: "User 1",
    dateOfBirth: "01/01/2002",
    password: "dummy",
    role: "Mentor",
  });

  const [goals, setGoals] = useState([
    { id: 1, progress: 5, total: 10, title: "Learn Python" },
    { id: 2, progress: 4, total: 10, title: "Learn Java" },
    { id: 3, progress: 2, total: 5, title: "Learn C++" },
  ]);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />

        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Dashboard goals={goals} setGoals={setGoals} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute user={user}>
              <div className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 goals">
                <Goals
                  goals={goals}
                  setGoals={setGoals}
                  renderViewAll={false}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-goal"
          element={
            <ProtectedRoute user={user}>
              <div className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 goals">
                <AddGoal
                  user={user}
                  setGoals={setGoals}
                  renderViewAll={false}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/logout"
          element={
            <ProtectedRoute user={user}>
              <Logout setUser={setUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
