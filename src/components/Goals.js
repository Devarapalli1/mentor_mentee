import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { get, push, ref, set, remove } from "firebase/database";

const Goals = ({
  user,
  goals,
  setGoals,
  setCurrentGoal,
  loadGoals,
  renderViewAll = false,
  isSameUser = true,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const handleAddNewGoalClick = () => {
    navigate("/add-goal");
  };

  const handleEditGoalClick = (goal) => {
    navigate("/edit-goal", { state: { goal } });
  };

  const handleDeleteGoalClick = (goal) => {
    setGoalToDelete(goal);
    setShowModal(true);
  };

  const handleTitleClick = (goal) => {
    navigate(`/goal/${goal.id}`, { state: { goal } });
  };

  const confirmDelete = async () => {
    if (goalToDelete) {
      const dbRef = ref(db, "goals/" + goalToDelete.id);
      await remove(dbRef);

      const newNotifRef = push(ref(db, "notifications"));
      await set(newNotifRef, {
        userid:
          goalToDelete.mentorId === user.id
            ? goalToDelete.menteeId
            : goalToDelete.mentorId,
        text: `Goal ${goalToDelete.title} has been deleted by ${user.username}.`,
      });

      setGoals((prevGoals) =>
        prevGoals.filter((currgoal) => currgoal.id !== goalToDelete.id)
      );
      setShowModal(false);
      setGoalToDelete(null);
    }
  };

  const handleViewAllClick = () => {
    navigate("/goals");
  };

  let classes = renderViewAll ? "dashboard-card" : "goal-card";
  classes += " mb-3";

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <>
      <Card className={classes}>
        <Card.Header className="h6 bg-primary d-flex justify-content-between">
          <div className="fw-bold color-contrast-with-bg">Goals</div>
          {isSameUser &&
            (renderViewAll ? (
              <div className="cursor-pointer fs-6" onClick={handleViewAllClick}>
                View all {"->"}
              </div>
            ) : (
              <div
                className="cursor-pointer fs-6"
                onClick={handleAddNewGoalClick}
              >
                <em className="fa-solid fa-circle-plus"></em>
              </div>
            ))}
        </Card.Header>
        <Card.Body className="bg-secondary color-contrast-color">
          {goals?.length > 0 &&
            goals?.map((goal) => (
              <div
                key={goal.id}
                className="d-flex justify-content-between align-items-center bg-third px-4 my-1"
              >
                <span
                  onClick={() => {
                    handleTitleClick(goal);
                  }}
                >
                  {goal.title}
                </span>
                {user.id === goal.userid && (
                  <div>
                    <Button
                      variant="link"
                      className="me-2"
                      onClick={() => {
                        handleEditGoalClick(goal);
                      }}
                    >
                      Edit
                      <em className="fa fa-pencil"></em>
                    </Button>
                    <Button
                      variant="link"
                      className="text-danger"
                      onClick={() => {
                        handleDeleteGoalClick(goal);
                      }}
                    >
                      Delete
                      <em className="fa fa-trash"></em>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          {goals.length === 0 && "No Goals available."}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the goal "{goalToDelete?.title}"?
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
    </>
  );
};

export default Goals;
