import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import Goals from "./components/Goals";
import AddGoal from "./components/AddGoal";
import EditGoal from "./components/EditGoal";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState({});

  const loginUser = async (email, password) => {
    const dbRef = ref(db, "users");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const users = snapshot.val();

      const tempUsers = Object.keys(users)
        .map((id) => {
          return {
            ...users[id],
            id,
          };
        })
        .filter((user) => {
          return user.email === email && user.password === password;
        });

      if (tempUsers.length === 1) {
        setUser({
          id: tempUsers[0].id,
          username: tempUsers[0].username,
          email: tempUsers[0].email,
          role: tempUsers[0].role,
          dateOfBirth: tempUsers[0].dateOfBirth,
        });
      }
    } else {
      setUser({});
    }
  };

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Learn Python",
      description: "Complete the Python for Everybody course.",
      mentor: "John Doe",
      mentee: "Alice Smith",
      dateCreated: "2024-01-01",
      progress: 5,
      total: 10,
    },
    {
      id: 2,
      title: "Learn Java",
      description: "Work through the Java Fundamentals course on Codecademy.",
      mentor: "John Doe",
      mentee: "Bob Johnson",
      dateCreated: "2024-01-01",
      progress: 4,
      total: 10,
    },
    {
      id: 3,
      title: "Learn C++",
      description: "Build a basic game using C++.",
      mentor: "John Doe",
      mentee: "Sara Connor",
      dateCreated: "2024-01-01",
      progress: 2,
      total: 5,
    },
  ]);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/register"
          element={
            <Register user={user} setUser={setUser} loginUser={loginUser} />
          }
        />

        <Route
          path="/login"
          element={
            <Login user={user} setUser={setUser} loginUser={loginUser} />
          }
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
                <AddGoal user={user} setGoals={setGoals} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-goal"
          element={
            <ProtectedRoute user={user}>
              <div className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 goals">
                <EditGoal user={user} setGoals={setGoals} />
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
