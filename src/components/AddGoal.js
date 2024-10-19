import React, { useState, useEffect } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const AddGoal = ({ user, setGoals, loadGoals }) => {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [mentorId, setMentorId] = useState(
    user.role === "Mentor" ? user.id : ""
  );
  const [menteeId, setMenteeId] = useState(
    user.role === "Mentee" ? user.id : ""
  );
  const [dateOfCreation, setDateOfCreation] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();

  const [users, setUsers] = useState({}); // Initialize as an empty object

  // Load users from the database
  const loadUsers = async () => {
    try {
      const dbRef = ref(db, "users");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUsers(userData); // Store users as an object
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
            };
          });

        setConnections(userConnections);
      }
    } catch (error) {
      setAlertMessage("Error loading connections: " + error.message);
      setAlertType("danger");
    }
  };

  // Load user's connections to populate the mentor/mentee dropdown
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      loadConnections(); // Ensure users data is loaded before loading connections
    }
  }, [users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      !goalTitle ||
      !goalDescription ||
      !mentorId ||
      !menteeId ||
      !dateOfCreation
    ) {
      setAlertMessage("Please fill in all fields.");
      setAlertType("danger");
      return;
    }

    try {
      const newDocRef = push(ref(db, "goals"));
      await set(newDocRef, {
        title: goalTitle,
        description: goalDescription,
        mentorId,
        menteeId,
        dateCreated: dateOfCreation,
        userid: user.id,
        completed: false,
        progress: 0,
        userid: user.id,
        completed: false,
        progress: 0,
      });

      await loadGoals();

      // Reset form
      setGoalTitle("");
      setGoalDescription("");
      setMentorId("");
      setMenteeId("");
      setDateOfCreation("");

      // Show success alert
      setAlertMessage("Goal added successfully!");
      setAlertType("success");

      // Navigate back to goals page after a delay
      setTimeout(() => {
        navigate("/goals");
      }, 2000);
    } catch (error) {
      setAlertMessage("Add failed: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }}>
        <Card.Header className="bg-primary text-white text-center">
          New Goal
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
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="goalDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                required
              />
            </Form.Group>

            {user.role === "Mentor" ? (
              <Form.Group controlId="menteeId">
                <Form.Label>Select Mentee</Form.Label>
                <Form.Control
                  as="select"
                  value={menteeId}
                  onChange={(e) => setMenteeId(e.target.value)}
                  required
                >
                  <option value="">Select Mentee</option>
                  {connections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
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
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  required
                >
                  <option value="">Select Mentor</option>
                  {connections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
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
                value={dateOfCreation}
                onChange={(e) => setDateOfCreation(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-center align-items-center">
              <Button
                variant="primary"
                className="bg-primary mt-3 w-50 border-0"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddGoal;
