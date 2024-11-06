import React, { useState, useEffect } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const EditGoal = ({ user, setGoals }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [goal, setGoal] = useState({
    id: null,
    title: "",
    description: "",
    mentorId: "",
    menteeId: "",
    dateCreated: "",
    completed: false,
    progress: 0,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);

  // Load users from the database
  const loadUsers = async () => {
    try {
      const dbRef = ref(db, "users");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUsers(userData);
      }
    } catch (error) {
      console.error("Error loading users: ", error);
    }
  };

  const loadConnections = async () => {
    try {
      const dbRef = ref(db, "connections");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const allConnections = snapshot.val();

        // Filter connections by opposite role
        const userConnections = Object.keys(allConnections)
          .map((id) => ({ id, ...allConnections[id] }))
          .filter(
            (connection) =>
              (user.role === "Mentor" && connection.mentor === user.id) ||
              (user.role === "Mentee" && connection.mentee === user.id)
          )
          .map((connection) => {
            // Make sure the users object is loaded and contains the relevant user
            const targetUserId =
              user.role === "Mentor" ? connection.mentee : connection.mentor;
            const targetUser = users[targetUserId];

            return {
              id: targetUserId,
              username: targetUser ? targetUser.username : "Unknown",
              mentee: connection.mentee,
              mentor: connection.mentor,
            };
          });

        setConnections(userConnections);
      }
    } catch (error) {
      setAlertMessage("Error loading connections: " + error.message);
      setAlertType("danger");
    }
  };

  // Load users and connections
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      loadConnections(); // Ensure users data is loaded before loading connections
    }
  }, [users]);

  useEffect(() => {
    const { goal } = location.state || {};
    if (goal) {
      setGoal(goal);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoal((prevGoal) => ({
      ...prevGoal,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !goal.title ||
      !goal.description ||
      !goal.mentorId ||
      !goal.menteeId ||
      !goal.dateCreated
    ) {
      setAlertMessage("Please fill in all fields.");
      setAlertType("danger");
      return;
    }

    const newDocRef = ref(db, "goals/" + goal.id);
    await set(newDocRef, {
      ...goal,
      title: goal.title,
      description: goal.description,
      mentorId: goal.mentorId,
      menteeId: goal.menteeId,
      dateCreated: goal.dateCreated,
      userid: user.id,
      completed: goal.completed,
      progress: goal.progress,
    });

    const newNotifRef = push(ref(db, "notifications"));
    await set(newNotifRef, {
      userid: goal.mentorId === user.id ? goal.menteeId : goal.mentorId,
      text: `Goal: ${goal.title} has been updated by ${user.username}.`,
    });

    setGoals((prevGoals) =>
      prevGoals.map((g) => (g.id === goal.id ? { ...g, ...goal } : g))
    );

    setAlertMessage("Goal updated successfully!");
    setAlertType("success");

    setTimeout(() => navigate("/goals"), 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }}>
        <Card.Header className="bg-primary text-white text-center">
          Edit Goal
        </Card.Header>
        <Card.Body>
          {alertMessage && (
            <Alert
              variant={alertType}
              onClose={() => setAlertMessage("")}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="goalTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={goal.title}
                onChange={handleInputChange}
                required
                disabled={goal.userid !== user.id}
              />
            </Form.Group>

            <Form.Group controlId="goalDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={goal.description}
                onChange={handleInputChange}
                required
                disabled={goal.userid !== user.id}
              />
            </Form.Group>

            {user.role === "Mentor" ? (
              <Form.Group controlId="menteeId">
                <Form.Label>Select Mentee</Form.Label>
                <Form.Control
                  as="select"
                  name="menteeId"
                  value={goal.menteeId}
                  onChange={handleInputChange}
                  required
                  disabled={goal.userid !== user.id}
                >
                  <option value="">Select Mentee</option>
                  {connections.map((connection) => (
                    <option key={connection.mentee} value={connection.mentee}>
                      {connection.username}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            ) : (
              <Form.Group controlId="mentorId">
                <Form.Label>Select Mentor</Form.Label>
                <Form.Control
                  as="select"
                  name="mentorId"
                  value={goal.mentorId}
                  onChange={handleInputChange}
                  required
                  disabled={goal.userid !== user.id}
                >
                  <option value="">Select Mentor</option>
                  {connections.map((connection) => (
                    <option key={connection.mentor} value={connection.mentor}>
                      {connection.username}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group controlId="dateOfCreation">
              <Form.Label>Date of Creation</Form.Label>
              <Form.Control
                type="date"
                name="dateCreated"
                value={goal.dateCreated}
                onChange={handleInputChange}
                required
                disabled
              />
            </Form.Group>

            <div className="d-flex justify-content-center align-items-center">
              <Button
                variant="primary"
                className="bg-primary mt-3 w-50 border-0"
                type="submit"
              >
                Update Goal
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditGoal;
