import { get, push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

const Meetings = ({ user, meetings, setMeetings, loadMeetings }) => {
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

  const handleRedirectToUrl = (meeting) => {
    if (meeting.url) {
      window.open(meeting.url, "_blank", "noopener,noreferrer");
    } else {
      alert("No URL provided for this meeting.");
    }
  };

  // Fetch mentors or mentees from connections based on user's role
  useEffect(() => {
    const loadUsersFromConnections = async () => {
      try {
        const oppositeRole = user.role === "Mentor" ? "Mentee" : "Mentor";
        const connectionsRef = ref(db, `connections/${user.id}`); // Assuming connections are stored under user ID in the "connections" node

        const connectionsSnapshot = await get(connectionsRef);
        if (connectionsSnapshot.exists()) {
          const connectionsData = connectionsSnapshot.val();
          const connectionIds = Object.keys(connectionsData);

          const usersRef = ref(db, "users"); // Fetching user profiles from "users" node
          const usersSnapshot = await get(usersRef);

          if (usersSnapshot.exists()) {
            const users = usersSnapshot.val();
            const filteredUsers = connectionIds
              .map((id) => ({ id, ...users[id] }))
              .filter((usr) => usr && usr.role === oppositeRole);

            setAvailableUsers(filteredUsers);
          }
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    loadUsersFromConnections();
  }, [user.role, user.id]);

  return (
    <Row className="pt-5">
      <Col md={6}>
        <Card className="dashboard-card mb-3">
          <Card.Header className="h6 bg-primary fw-bold">
            {isEditing ? "Update" : "Add a"} Meeting
          </Card.Header>
          <Card.Body className="bg-secondary">
            <Form onSubmit={handleMeetingSubmit}>
              <Form.Group controlId="meetingTitle">
                <Form.Label className="color-contrast-color">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newMeeting.title}
                  onChange={handleMeetingChange}
                  requiredz
                />
              </Form.Group>

              {/* New dropdown for selecting mentor/mentee */}
              <Form.Group controlId="selectUser">
                <Form.Label className="color-contrast-color">
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
                <Form.Label className="color-contrast-color">
                  Meeting URL
                </Form.Label>
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
                <Form.Label className="color-contrast-color">
                  Start Time
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startTime"
                  value={newMeeting.startTime}
                  onChange={handleMeetingChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="meetingEndTime">
                <Form.Label className="color-contrast-color">
                  End Time
                </Form.Label>
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
              {isEditing && (
                <Button
                  variant="primary"
                  className="bg-primary mt-2 w-50 border-0"
                  onClick={handleStopEditing}
                >
                  Create New
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="dashboard-card">
          <Card.Header className="h6 bg-primary d-flex justify-content-between">
            <div className="fw-bold">Upcoming Meetings</div>
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
                        <em
                          className="fa fa-pencil"
                          onClick={() => handleEditClick(meeting)}
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                        ></em>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-link-${meeting.id}`}>
                            Open URL
                          </Tooltip>
                        }
                      >
                        <em
                          className="fa fa-link"
                          onClick={() => handleRedirectToUrl(meeting)}
                          style={{ cursor: "pointer" }}
                        ></em>
                      </OverlayTrigger>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Meetings;
