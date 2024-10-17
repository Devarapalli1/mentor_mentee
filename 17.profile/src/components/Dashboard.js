import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Goals from "./Goals";
import GoalsChart from "./GoalsChart";

const Dashboard = ({ goals, setGoals, loadGoals }) => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([
    { id: 1, title: "Meeting for Python Learning" },
    { id: 2, title: "Brain Storming Session" },
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const handleMeetingChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();

    if (!newMeeting.title) {
      alert("Meeting title is required.");
      return;
    }

    if (!newMeeting.startTime || !newMeeting.endTime) {
      alert("Both start time and end time are required.");
      return;
    }

    const startTime = new Date(newMeeting.startTime);
    const endTime = new Date(newMeeting.endTime);
    if (startTime >= endTime) {
      alert("Start time must be before end time.");
      return;
    }

    const now = new Date();
    if (startTime < now || endTime < now) {
      alert("Start time and end time must be in the future.");
      return;
    }

    setMeetings((prev) => [
      ...prev,
      { id: prev.length + 1, title: newMeeting.title },
    ]);
    setNewMeeting({ title: "", description: "", startTime: "", endTime: "" });
  };

  const handleViewAllMeetingsClick = () => {
    navigate("/meetings");
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-around align-items-center vw-100 vh-100 pt-5 dashboard"
    >
      <Row className="pt-4">
        <Col md={12}>
          <Row>
            <Col md={6}>
              <Goals
                goals={goals}
                setGoals={setGoals}
                loadGoals={loadGoals}
                renderViewAll={true}
              />
            </Col>

            <Col md={6}>
              <Card className="dashboard-card mb-3">
                <Card.Header className="h6 bg-primary fw-bold">
                  Current Progress
                </Card.Header>
                <Card.Body className="bg-secondary">
                  <div className="text-center">
                    <GoalsChart goals={goals} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col md={12}>
          <Row>
            <Col md={6}>
              <Card className="dashboard-card mb-3">
                <Card.Header className="h6 bg-primary fw-bold">
                  Add a Meeting
                </Card.Header>
                <Card.Body className="bg-secondary">
                  <Form onSubmit={handleMeetingSubmit}>
                    <Form.Group controlId="meetingTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={newMeeting.title}
                        onChange={handleMeetingChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="meetingDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={newMeeting.description}
                        onChange={handleMeetingChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="meetingStartTime">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="startTime"
                        value={newMeeting.startTime}
                        onChange={handleMeetingChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="meetingEndTime">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="endTime"
                        value={newMeeting.endTime}
                        onChange={handleMeetingChange}
                        required
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button
                        variant="primary"
                        type="submit"
                        className="bg-primary mt-2 w-50 border-0"
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="dashboard-card">
                <Card.Header className="h6 bg-primary d-flex justify-content-between">
                  <div className="fw-bold">Upcoming Meetings</div>
                  <div
                    className="cursor-pointer fs-6"
                    onClick={handleViewAllMeetingsClick}
                  >
                    View all {"->"}
                  </div>
                </Card.Header>
                <Card.Body className="bg-secondary">
                  <ListGroup>
                    {meetings.slice(0, 4).map((meeting) => (
                      <ListGroup.Item
                        key={meeting.id}
                        className="rounded-0 my-1"
                      >
                        {meeting.title}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
