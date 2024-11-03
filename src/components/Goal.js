import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Modal } from "react-bootstrap";
import { ref, remove } from "firebase/database";
import { db } from "../firebase/config";

const ViewGoal = ({ user, goals, setGoals, setCurrentGoal, loadGoals }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currGoal = location.state?.goal;

  const [goal, setGoal] = useState(currGoal);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (goal.mentorId !== user.id && goal.menteeId !== user.id) {
      navigate("/");
    }
  }, [goal]);

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

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="goal-card me-5">
        <Card.Header className="h6 bg-primary d-flex justify-content-between align-items-center">
          <div className="fw-bold">{goal.title}</div>
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
          {goal.comments?.length > 0 &&
            goal.comments.map((comment, index) => {
              return (
                <div className="my-2">
                  <h5 className="mb-1">{comment.name}</h5>
                  <p className="mt-0" key={index}>
                    {comment.text}
                  </p>
                </div>
              );
            })}
        </Card.Body>
      </Card>

      <Card className="goal-card">
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
