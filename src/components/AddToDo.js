import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "../firebase/config";
import { Card, Button, Form } from "react-bootstrap";

const AddTodo = ({ loadGoals }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const goal = location.state?.goal;

  const [title, setTitle] = useState("");

  // Set current date as the default for dateOfCreation
  const [dateOfCreation, setDateOfCreation] = useState(
    new Date().toISOString().split("T")[0] // Format YYYY-MM-DD
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goal.id) {
      alert("Goal ID is missing. Please go back and select a goal.");
      return;
    }

    if (!title || !dateOfCreation) {
      alert("Please fill in all fields.");
      return;
    }

    const newTodo = {
      title,
      dateOfCreation,
      completed: false,
    };

    const updatedTodos = [...(goal.todos || []), newTodo];

    const todosRef = ref(db, `goals/${goal.id}`);
    await set(todosRef, {
      ...goal,
      todos: updatedTodos,
    });

    await loadGoals();

    navigate(`/goal/${goal.id}`);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-5 shadow">
        <h3 className="text-center mb-4">New To-Do</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="todoTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="dateOfCreation">
            <Form.Label>Date of Creation</Form.Label>
            <Form.Control
              type="date"
              value={dateOfCreation}
              onChange={(e) => setDateOfCreation(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 bg-primary border-0"
          >
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddTodo;
