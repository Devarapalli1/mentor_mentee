import React, { useState, useEffect } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const EditGoal = ({ user, setGoals }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [goal, setGoal] = useState({
    id: null,
    title: "",
    description: "",
    mentor: "",
    mentee: "",
    dateCreated: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    const { goal } = location.state || {};
    if (goal) {
      setGoal(goal);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoal((prevGoal) => ({
      ...prevGoal,
      [name]: name === "dateCreated" ? value : value.trim(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !goal.title ||
      !goal.description ||
      !goal.mentor ||
      !goal.mentee ||
      !goal.dateCreated
    ) {
      setAlertMessage("Please fill in all fields.");
      setAlertType("danger");
      return;
    }

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
              />
            </Form.Group>

            <Form.Group controlId="mentorName">
              <Form.Label>Mentor Name</Form.Label>
              <Form.Control
                type="text"
                name="mentor"
                value={goal.mentor}
                onChange={handleInputChange}
                required
                disabled={user.role === "Mentor"}
              />
            </Form.Group>

            <Form.Group controlId="menteeName">
              <Form.Label>Mentee Name</Form.Label>
              <Form.Control
                type="text"
                name="mentee"
                value={goal.mentee}
                onChange={handleInputChange}
                required
                disabled={user.role === "Mentee"}
              />
            </Form.Group>

            <Form.Group controlId="dateOfCreation">
              <Form.Label>Date of Creation</Form.Label>
              <Form.Control
                type="date"
                name="dateCreated"
                value={goal.dateCreated}
                onChange={handleInputChange}
                required
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
