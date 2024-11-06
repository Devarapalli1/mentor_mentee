import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { ref, remove, set, update } from "firebase/database";
import { db } from "../firebase/config";

const ViewGoal = ({ user, goals, setGoals, loadGoals }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [goal, setGoal] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const currGoal = goals.find((goal) => goal.id === id);
    setGoal(currGoal);

    if (currGoal.mentorId !== user.id && currGoal.menteeId !== user.id) {
      navigate("/");
    }

    loadGoals();
  }, []);

  useEffect(() => {
    const currGoal = goals.find((goal) => goal.id === id);
    setGoal(currGoal);

    if (currGoal.mentorId !== user.id && currGoal.menteeId !== user.id) {
      navigate("/");
    }
  }, [goals]);

  const handleEditGoalClick = (goal) => {
    navigate("/edit-goal", { state: { goal } });
  };

  const handleDeleteGoalClick = (goal) => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (goal) {
      const dbRef = ref(db, "goals/" + goal.id);
      await remove(dbRef);

      setGoals((prevGoals) =>
        prevGoals.filter((currgoal) => currgoal.id !== goal.id)
      );
      setShowModal(false);
      navigate("/goals");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    const newComment = {
      name: user.username,
      text: comment,
    };

    const updatedComments = [...(goal.comments || []), newComment];
    const goalRef = ref(db, "goals/" + goal.id);

    await set(goalRef, {
      ...goal,
      comments: updatedComments,
    });

    setGoal((prevGoal) => ({
      ...prevGoal,
      comments: updatedComments,
    }));

    setComment("");
  };

  const handleAddNewTodoClick = () => {
    navigate("/add-todo", { state: { goal: goal } });
  };

  const handleEditTodo = (todo, index) => {
    navigate("/edit-todo", {
      state: { todo: { ...todo, index }, goalId: goal.id },
    });
  };

  // Toggle todo completion status
  const handleToggleTodo = async (todoIndex) => {
    const updatedTodos = goal.todos.map((todo, index) => {
      if (index === todoIndex) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    const goalRef = ref(db, "goals/" + goal.id);
    await update(goalRef, { todos: updatedTodos });

    setGoal((prevGoal) => ({
      ...prevGoal,
      todos: updatedTodos,
    }));

    // Update the progress after toggling
    updateGoalProgress(updatedTodos);
    loadGoals();
  };

  // Function to calculate and update goal progress
  const updateGoalProgress = async (todos) => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter((todo) => todo.completed).length;

    // Calculate progress percentage
    const newProgress =
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const goalRef = ref(db, "goals/" + goal.id);

    // Check if the goal is completed
    const isCompleted = newProgress === 100;

    await update(goalRef, { progress: newProgress, completed: isCompleted });

    setGoal((prevGoal) => ({
      ...prevGoal,
      progress: newProgress,
      completed: isCompleted, // Update completed status
    }));
  };

  // Delete todo function
  const handleDeleteTodo = async (todoIndex) => {
    const updatedTodos = goal.todos.filter((_, index) => index !== todoIndex);
    const goalRef = ref(db, "goals/" + goal.id);

    await update(goalRef, { todos: updatedTodos });

    setGoal((prevGoal) => ({
      ...prevGoal,
      todos: updatedTodos,
    }));

    // Update the progress after deleting a todo
    updateGoalProgress(updatedTodos);
    loadGoals();
  };

  return (
    <div className="d-flex justify-content-center align-items-start vh-100">
      <Card className="view-goal-card me-5">
        <Card.Header className="h6 bg-primary d-flex justify-content-between align-items-center">
          <div className="fw-bold">{goal.title}</div>
          {user.id === goal.userid && (
            <div>
              <Button
                variant="link"
                className="me-2"
                onClick={() => {
                  handleEditGoalClick(goal);
                }}
              >
                <i className="fa fa-pencil"></i>
              </Button>
              <Button
                variant="link"
                className="text-danger"
                onClick={() => {
                  handleDeleteGoalClick(goal);
                }}
              >
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          )}
        </Card.Header>
        <Card.Body>
          <p>
            <b>Description</b>: {goal.description}
          </p>
          <p>
            <b>Progress</b>: {goal.progress} / 100
          </p>
          <p>
            <b>Status</b>: {goal.completed ? "Completed" : "In Progress"}
          </p>
          <p>
            <b>Mentor</b>: {goal.mentorId}
          </p>
          <p>
            <b>Mentee</b>: {goal.menteeId}
          </p>

          <p>
            <b>Comments</b>:
          </p>

          <Form onSubmit={addComment}>
            <Row>
              <Col md={8}>
                <Form.Group controlId="goalTitle">
                  <Form.Control
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Button
                  variant="primary"
                  className="bg-primary border-0"
                  type="submit"
                >
                  Add Comment
                </Button>
              </Col>
            </Row>
          </Form>

          {goal.comments?.length > 0 &&
            goal.comments.map((comment, index) => {
              return (
                <div className="my-2" key={index}>
                  <h5 className="mb-1">{comment.name}</h5>
                  <p className="mt-0">{comment.text}</p>
                </div>
              );
            })}
        </Card.Body>
      </Card>

      <Card className="view-goal-card">
        <Card.Header className="h6 bg-primary d-flex justify-content-between align-items-center">
          <div className="fw-bold my-2">TO-DO List</div>
          <div>
            <div
              className="cursor-pointer fs-6"
              onClick={handleAddNewTodoClick}
            >
              <i className="fa-solid fa-circle-plus"></i>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {goal.todos && goal.todos.length > 0 ? (
            goal.todos.map((todo, index) => (
              <div
                key={index}
                className="todo-item my-2 bg-primary px-4 py-1 d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(index)}
                  />
                  <p
                    className={`m-0 ms-2 todo-${
                      todo.completed ? "completed" : "pending"
                    }`}
                  >
                    <b>Title:</b> {todo.title}
                  </p>
                </div>
                <div>
                  <Button
                    variant="link"
                    className="text-primary"
                    onClick={() => handleEditTodo(todo, index)}
                  >
                    <i className="fa fa-pencil"></i>
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    <i className="fa fa-trash"></i>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No todos available for this goal.</p>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this goal? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewGoal;
