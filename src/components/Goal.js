import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { ref, remove, set, update } from "firebase/database";
import { db } from "../firebase/config";

const ViewGoal = ({ user, goals, setGoals, setCurrentGoal, loadGoals }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [goal, setGoal] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [comment, setComment] = useState("");

  useEffect(() => {
    const currGoal = goals.filter((goal) => goal.id === id)[0];
    setGoal(currGoal);

    if (currGoal.mentorId !== user.id && currGoal.menteeId !== user.id) {
      navigate("/");
    }

    loadGoals();
  }, []);

  useEffect(() => {
    const currGoal = goals.filter((goal) => goal.id === id)[0];
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
        </Card.Header>
        <Card.Body></Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the goal "{goal?.title}"?
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
