import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useAsyncError,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import Goals from "./components/Goals";
import Goal from "./components/Goal";
import Goal from "./components/Goal";
import AddGoal from "./components/AddGoal";
import EditGoal from "./components/EditGoal";
import AddToDo from "./components/AddToDo";
import EditToDo from "./components/EditToDo";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Connections from "./components/Connections";
import Forum from "./components/Forum";
import Notifications from "./components/Notifications";
import Meetings from "./components/Meetings";
import FAQ from "./components/FAQ";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState({
    connections: 0,
    dateOfBirth: "2009-01-01",
    email: "test@gmail.com",
    password: "test123",
    rating: 5,
    role: "Mentor",
    skills: "Python,React,Java",
    username: "test mentor",
    id: "-O9SsfQ_UXgFC1wx37L5",
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
        localStorage.setItem(
          "mentor-mentee-user",
          JSON.stringify(tempUsers[0])
        );
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
          return goal.mentorId === user.id || goal.menteeId === user.id;
        });

      if (tempGoals.length > 0) {
        setGoals(tempGoals);
      } else {
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
  };

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const dbRef = ref(db, "notifications");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const notifications = snapshot.val();

      const tempNotifications = Object.keys(notifications)
        .map((id) => {
          return {
            ...notifications[id],
            id,
          };
        })
        .filter((notification) => notification.userid === user.id);

      if (tempNotifications.length > 0) {
        setNotifications(tempNotifications);
      } else {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  };

  const [meetings, setMeetings] = useState([]);

  const loadMeetings = async () => {
    const dbRef = ref(db, "meetings");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const meetings = snapshot.val();

      const tempMeetings = Object.keys(meetings)
        .map((id) => {
          return {
            ...meetings[id],
            id,
          };
        })
        .filter(
          (meeting) =>
            meeting.mentorId === user.id || meetings.menteeId === user.id
        );

      if (tempMeetings.length > 0) {
        setMeetings(tempMeetings);
      } else {
        setMeetings([]);
      }
    } else {
      setMeetings([]);
    }
  };

  const [faqs, setFaqs] = useState([]);

  const loadFAQ = async () => {
    const dbRef = ref(db, "faq");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const faqData = snapshot.val();
      const tempFAQ = Object.keys(faqData).map((id) => ({
        ...faqData[id],
        id,
      }));
      setFaqs(tempFAQ);
    } else {
      setFaqs([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadMeetings();

    const user = localStorage.getItem("mentor-mentee-user");
    try {
      if (user) {
        setUser(JSON.parse(user));
      }
    } catch (error) {}
  }, []);

  return (
    <Router>
      <Navbar user={user} notificationCount={notifications.length} />
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
                user={user}
                goals={goals}
                setGoals={setGoals}
                loadGoals={loadGoals}
                meetings={meetings}
                setMeetings={setMeetings}
                loadMeetings={loadMeetings}
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
                  user={user}
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
          path="/goal/:id"
          element={
            <ProtectedRoute user={user}>
              <div className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 goals">
                <Goal
                  goals={goals}
                  setGoals={setGoals}
                  renderViewAll={false}
                  loadGoals={loadGoals}
                  user={user}
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
          path="/add-todo"
          element={
            <ProtectedRoute user={user}>
              <div className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 goals">
                <AddToDo loadGoals={loadGoals} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-todo"
          element={
            <ProtectedRoute user={user}>
              <div className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 goals">
                <EditToDo loadGoals={loadGoals} />
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
          path="/edit-profile/:id"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 pt-5 goals">
                <EditProfile currUser={user} setUser={setUser} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/connections"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 p-5 connections">
                <Connections currUser={user} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forum"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 p-5 connections">
                <Forum user={user} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faq"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 p-5 faqs">
                <FAQ
                  user={user}
                  faqs={faqs}
                  setFaqs={setFaqs}
                  loadFAQ={loadFAQ}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 p-5 notifications">
                <Notifications
                  user={user}
                  notifications={notifications}
                  loadNotifications={loadNotifications}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings"
          element={
            <ProtectedRoute user={user}>
              <div className="vw-100 vh-100 p-5 meetings">
                <Meetings
                  user={user}
                  meetings={meetings}
                  loadMeetings={loadMeetings}
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
