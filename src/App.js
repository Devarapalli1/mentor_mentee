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
import Profile from "./components/Profile";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState({
    dateOfBirth: "2000-01-01",
    email: "mentor@gmail.com",
    password: "mentor123",
    role: "Mentor",
    username: "Mentor",
    id: "-O9LR5XUZcX-elSGpYno",
  });

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
        setUser(tempUsers[0]);
        console.log(tempUsers[0]);
      }
    } else {
      setUser({});
    }
  };

  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    const dbRef = ref(db, "goals");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const goals = snapshot.val();

      const tempGoals = Object.keys(goals)
        .map((id) => {
          return {
            ...goals[id],
            id,
          };
        })
        .filter((goal) => {
          return goal.userid === user.id;
        });

      if (tempGoals.length > 0) {
        setGoals(tempGoals);
        console.log(tempGoals);
      } else {
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
  };

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
              <Dashboard
                goals={goals}
                setGoals={setGoals}
                loadGoals={loadGoals}
              />
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
                  loadGoals={loadGoals}
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
                  loadGoals={loadGoals}
                />
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
          path="/profile/:id"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 pt-5 goals">
                <Profile currUser={user} />
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
