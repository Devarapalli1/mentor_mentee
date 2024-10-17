import React, { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const AddGoal = ({ user, setGoals, loadGoals }) => {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [mentorName, setMentorName] = useState(
    user.role === "Mentor" ? user.username : ""
  );
  const [menteeName, setMenteeName] = useState(
    user.role === "Mentee" ? user.username : ""
  );
  const [dateOfCreation, setDateOfCreation] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();

  console.log(dateOfCreation);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      !goalTitle ||
      !goalDescription ||
      !mentorName ||
      !menteeName ||
      !dateOfCreation
    ) {
      setAlertMessage("Please fill in all fields.");
      setAlertType("danger");
      return;
    }

    // Update goals state
    try {
      const newDocRef = push(ref(db, "goals"));
      await set(newDocRef, {
        title: goalTitle,
        description: goalDescription,
        mentor: mentorName,
        mentee: menteeName,
        dateCreated: dateOfCreation,
        userid: user.id,
        completed: false,
        progress: 0,
      });

      await loadGoals();

      // Reset form
      setGoalTitle("");
      setGoalDescription("");
      setMentorName("");
      setMenteeName("");
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

            <Form.Group controlId="mentorName">
              <Form.Label>Mentor Name</Form.Label>
              <Form.Control
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                required
                disabled={user.role === "Mentor"}
              />
            </Form.Group>

            <Form.Group controlId="menteeName">
              <Form.Label>Mentee Name</Form.Label>
              <Form.Control
                type="text"
                value={menteeName}
                onChange={(e) => setMenteeName(e.target.value)}
                required
                disabled={user.role === "Mentee"}
              />
            </Form.Group>

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
