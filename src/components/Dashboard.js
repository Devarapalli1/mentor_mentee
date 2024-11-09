import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Goals from "./Goals";
import GoalsChart from "./GoalsChart";
import { get, push, ref, set } from "firebase/database";
import { db } from "../firebase/config";

const Dashboard = ({
  user,
  goals,
  setGoals,
  loadGoals,
  meetings,
  setMeetings,
  loadMeetings,
}) => {
  const navigate = useNavigate();

  const [availableUsers, setAvailableUsers] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    startTime: "",
    endTime: "",
    url: "",
    mentorId: user.role === "Mentor" ? user.id : null,
    menteeId: user.role === "Mentee" ? user.id : null,
    createdBy: user.id,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleMeetingChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();

    if (
      !newMeeting.title ||
      !newMeeting.startTime ||
      !newMeeting.endTime ||
      !newMeeting.url
    ) {
      alert("All fields are required.");
      return;
    }

    const meetingRef = isEditing
      ? ref(db, "meetings/" + newMeeting.id) // Reference for updating
      : push(ref(db, "meetings")); // Reference for creating

    await set(meetingRef, newMeeting);

    await loadMeetings();
    setNewMeeting({
      title: "",
      startTime: "",
      endTime: "",
      url: "", // Reset URL field
      mentorId: user.role === "Mentor" ? user.id : null,
      menteeId: user.role === "Mentee" ? user.id : null,
      createdBy: user.id,
    });
  };

  const handleEditClick = (meeting) => {
    setNewMeeting(meeting); // Load meeting details into the form
    setIsEditing(true);
  };

  const handleStopEditing = () => {
    setNewMeeting({
      title: "",
      startTime: "",
      endTime: "",
      url: "",
      mentorId: user.role === "Mentor" ? user.id : null,
      menteeId: user.role === "Mentee" ? user.id : null,
      createdBy: user.id,
    });
    setIsEditing(false);
  };

  const handleViewAllMeetingsClick = () => {
    navigate("/meetings");
  };

  const handleRedirectToUrl = (meeting) => {
    if (meeting.url) {
      window.open(meeting.url, "_blank", "noopener,noreferrer");
    } else {
      alert("No URL provided for this meeting.");
    }
  };

  // Fetch mentors or mentees based on user's role
  useEffect(() => {
    const loadUsers = async () => {
      const oppositeRole = user.role === "Mentor" ? "Mentee" : "Mentor";
      const dbRef = ref(db, "users"); // Assuming "users" contains user profiles

      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const filteredUsers = Object.keys(users)
          .map((id) => ({ id, ...users[id] }))
          .filter((user) => user.role === oppositeRole);
        setAvailableUsers(filteredUsers);
      }
    };

    loadUsers();
  }, [user.role]);

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
                user={user}
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
                  {isEditing ? "Update" : "Add a"} Meeting
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

                    {/* New dropdown for selecting mentor/mentee */}
                    <Form.Group controlId="selectUser">
                      <Form.Label className="primary-color">
                        Select {user.role === "Mentor" ? "Mentee" : "Mentor"}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name={user.role === "Mentor" ? "menteeId" : "mentorId"}
                        value={
                          user.role === "Mentor"
                            ? newMeeting.menteeId
                            : newMeeting.mentorId
                        }
                        onChange={handleMeetingChange}
                        required
                      >
                        <option value="">
                          Select {user.role === "Mentor" ? "Mentee" : "Mentor"}
                        </option>
                        {availableUsers.map((usr) => (
                          <option key={usr.id} value={usr.id}>
                            {usr.username}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="meetingURL">
                      <Form.Label>Meeting URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="url"
                        value={newMeeting.url}
                        onChange={handleMeetingChange}
                        required
                      />
                    </Form.Group>

                    {/* Other form fields for start and end time */}
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

                    <Button
                      variant="primary"
                      type="submit"
                      className="bg-primary mt-2 w-50 border-0"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="primary"
                      className="bg-primary mt-2 w-50 border-0"
                      onClick={handleStopEditing}
                    >
                      Create New
                    </Button>
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
                    {meetings &&
                      meetings.slice(0, 5).map((meeting) => (
                        <ListGroup.Item
                          key={meeting.id}
                          className="rounded-0 my-1 d-flex justify-content-between"
                        >
                          <div>{meeting.title}</div>
                          <div>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-edit-${meeting.id}`}>
                                  Edit Meeting
                                </Tooltip>
                              }
                            >
                              <i
                                className="fa fa-pencil"
                                onClick={() => handleEditClick(meeting)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                              ></i>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-link-${meeting.id}`}>
                                  Open URL
                                </Tooltip>
                              }
                            >
                              <i
                                className="fa fa-link"
                                onClick={() => handleRedirectToUrl(meeting)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </OverlayTrigger>
                          </div>
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
