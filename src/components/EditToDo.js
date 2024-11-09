// EditTodo.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, update } from "firebase/database";
import { db } from "../firebase/config";
import { Card, Button, Form } from "react-bootstrap";

const EditTodo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const todo = location.state?.todo;
  const goalId = location.state?.goalId;

  const [title, setTitle] = useState(todo.title);
  const [dateOfCreation, setDateOfCreation] = useState(todo.dateOfCreation);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTodo = {
      ...todo,
      title,
      dateOfCreation,
    };

    const todosRef = ref(db, `goals/${goalId}/todos/${todo.index}`);
    await update(todosRef, updatedTodo);

    navigate(`/goal/${goalId}`);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-5 shadow">
        <h3 className="text-center mb-4">Edit To-Do</h3>

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

export default EditTodo;
