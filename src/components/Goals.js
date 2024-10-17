import React, { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Goals = ({ goals, setGoals, setCurrentGoal, renderViewAll = false }) => {
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

  const confirmDelete = () => {
    setGoals((prevGoals) =>
      prevGoals.filter((goal) => goal.id !== goalToDelete.id)
    );
    setShowModal(false); 
    setGoalToDelete(null); 
  };

  const handleViewAllClick = () => {
    navigate("/goals");
  };

  let classes = renderViewAll ? "dashboard-card" : "goal-card";
  classes += " mb-3";

  return (
    <>
      <Card className={classes}>
        <Card.Header className="h6 bg-primary d-flex justify-content-between">
          <div className="fw-bold">Goals</div>
          {renderViewAll ? (
            <div
              className="cursor-pointer fs-6"
              onClick={handleViewAllClick} 
            >
              View all {"->"}
            </div>
          ) : (
            <div
              className="cursor-pointer fs-6"
              onClick={handleAddNewGoalClick}
            >
              <i className="fa-solid fa-circle-plus"></i>
            </div>
          )}
        </Card.Header>
        <Card.Body className="bg-secondary">
          {goals.slice(0, 4).map((goal) => (
            <div
              key={goal.id}
              className="d-flex justify-content-between align-items-center bg-third px-4 my-1"
            >
              <span>{goal.title}</span>
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
            </div>
          ))}
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
