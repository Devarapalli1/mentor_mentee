import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { db } from "../firebase/config";
import { get, ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Connections = ({ currUser }) => {
  const [connections, setConnections] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate();

  // Load connections from the database
  const loadConnections = async () => {
    try {
      const dbRef = ref(db, "connections");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const allConnections = snapshot.val();
        const userConnections = Object.keys(allConnections)
          .map((id) => ({ id, ...allConnections[id] }))
          .filter(
            (connection) =>
              connection.mentor === currUser.id ||
              connection.mentee === currUser.id
          );
        setConnections(userConnections);
      }
    } catch (error) {
      console.error("Error loading connections: ", error);
    }
  };

  // Load users from the database
  const loadUsers = async () => {
    try {
      const dbRef = ref(db, "users");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUsers(userData);
      }
    } catch (error) {
      console.error("Error loading users: ", error);
    }
  };

  // Accept a connection request
  const acceptConnection = async (connectionId) => {
    try {
      const dbRef = ref(db, `connections/${connectionId}`);
      await update(dbRef, { status: "accepted" });
      loadConnections();
    } catch (error) {
      console.error("Error accepting connection: ", error);
    }
  };

  // Reject a connection request
  const rejectConnection = async (connectionId) => {
    try {
      const dbRef = ref(db, `connections/${connectionId}`);
      await update(dbRef, { status: "rejected" });
      loadConnections();
    } catch (error) {
      console.error("Error rejecting connection: ", error);
    }
  };

  useEffect(() => {
    loadConnections();
    loadUsers();
  }, []);

  // Filter connections based on search term
  const filteredConnections = connections.filter((connection) => {
    const isMentor = connection.mentor === currUser.id;
    const connectedUserId = isMentor ? connection.mentee : connection.mentor;
    const connectedUser = users[connectedUserId];

    // If user is not loaded yet, skip filtering
    if (!connectedUser) return false;

    return connectedUser.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="connections">
      <h3 className="mb-4">Your Connections</h3>

      {/* Search bar */}
      <Form.Control
        type="text"
        placeholder="Search connections..."
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Row>
        {filteredConnections.map((connection) => {
          const isMentor = connection.mentor === currUser.id;
          const connectedUserId = isMentor
            ? connection.mentee
            : connection.mentor;
          const connectedUser = users[connectedUserId];
          const creator = users[connection.createdBy]; // Fetch the user who sent the request

          if (!connectedUser || !creator) return null;

          return (
            <Col md={6} key={connection.id}>
              <Card className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{connectedUser.username}</h5>
                      <p>Role: {connectedUser.role}</p>
                      <p>Status: {connection.status}</p>
                      <p>Request sent by: {creator.username}</p>{" "}
                      {/* Display who sent the request */}
                    </div>

                    <div>
                      {connection.status === "pending" && (
                        <>
                          {currUser.id !== connection.createdBy && ( // Only show buttons to the receiver of the request
                            <>
                              <Button
                                variant="success"
                                className="me-2"
                                onClick={() => acceptConnection(connection.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => rejectConnection(connection.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {connection.status === "accepted" && (
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate(`/profile/${connectedUserId}`)
                          }
                        >
                          View Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Connections;
