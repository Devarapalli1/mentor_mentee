import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col, Button } from "react-bootstrap";
import Goals from "./Goals";
import GoalsChart from "./GoalsChart";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const Profile = ({ currUser }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract user ID from the URL
  const [user, setUser] = useState(null); // State to store user data
  const [goals, setGoals] = useState([]);

  const [connections, setConnections] = useState([]);
  const [connection, setConnection] = useState({ status: "pending" });

  const fetchUserData = async () => {
    try {
      const dbRef = ref(db, `users/${id}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser({ id: id, ...userData }); // Set user data in state
      } else {
        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const loadGoals = async () => {
    const dbRef = ref(db, "goals");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const goals = snapshot.val();

      const tempGoals = Object.keys(goals)
        .map((id) => {
          return {
            ...goals[id],
            id,
          };
        })
        .filter((goal) => {
          return goal.userid === id;
        });

      if (tempGoals.length > 0) {
        setGoals(tempGoals);
        console.log(tempGoals);
      } else {
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
  };

  const loadConnections = async (currUser, user) => {
    const dbRef = ref(db, "connections");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const connections = snapshot.val();

      const tempConnections = Object.keys(connections).map((id) => {
        return {
          ...connections[id],
          id,
        };
      });

      setConnections(tempConnections);

      const tempFilteredConnections = tempConnections.filter((connection) => {
        return (
          connection.mentor ===
            (currUser.role === "Mentor" ? currUser.id : user.id) &&
          connection.mentee ===
            (currUser.role === "Mentee" ? currUser.id : user.id)
        );
      });

      if (tempFilteredConnections.length > 0) {
        setConnection(
          tempFilteredConnections[tempFilteredConnections.length - 1]
        );
      } else {
        setConnection({ status: "rejected" });
      }
    } else {
      setConnection({ status: "rejected" });
    }
  };

  const sendRequest = async (currUser, user) => {
    try {
      const newDocRef = push(ref(db, "connections"));
      await set(newDocRef, {
        mentor: currUser.role === "Mentor" ? currUser.id : user.id,
        mentee: currUser.role === "Mentee" ? currUser.id : user.id,
        status: "pending",
        createdBy: currUser.id,
        createdAt: new Date().toISOString(),
      });
      setConnection({ ...connection, status: "pending" });
    } catch (error) {
      console.error("Error sending connection request: ", error);
    }
  };

  // Fetch user data from Firebase based on user ID
  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const loadAll = async () => {
      await loadGoals();
      await loadConnections(currUser, user);
    };

    if (user?.id !== null && user?.id !== undefined) {
      loadAll();
    }
  }, [user]);

  // If user data is not loaded yet, display a loading message
  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="profile ">
      <Card className="p-3 my-4 profile-div rounded-0 bg-primary">
        <div className="d-flex justify-content-between align-items-center">
          <img
            className="avatar"
            style={{
              backgroundColor: "#ccc",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              marginRight: "2rem",
            }}
            src={
              user.role === "Mentor"
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD40po116YAeh-rRFht6E75O41HxxshP2UFw&s"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeFty9MSPvqt_0C1t8XMCRjj5sWycsXCQHlg&s"
            }
            alt="Mentor/Mentee"
          ></img>

          <div className="ml-4">
            <h4>
              {user.username}
              <span className="fw-normal h6 ms-5">{user.rating} ⭐</span>

              <span className="ms-5">
                {currUser.id !== user.id &&
                  (connection.status === "rejected" ? (
                    <Button
                      onClick={() => {
                        sendRequest(currUser, user);
                      }}
                      className="ms-4"
                      variant="success"
                    >
                      <i class="fa-solid fa-user-plus"></i>
                    </Button>
                  ) : connection.status === "pending" ? (
                    <Button className="ms-4" variant="warning">
                      <i class="fa-solid fa-person-circle-exclamation"></i>
                    </Button>
                  ) : (
                    <Button className="ms-4" variant="success">
                      <i class="fa-solid fa-user-group"></i> Friends
                    </Button>
                  ))}
              </span>
            </h4>

            <p>
              {user.skills &&
                user.skills.split(",").map((skill, index) => (
                  <span key={index} variant="info" className="h6 me-1">
                    {skill}
                    {index < user.skills.split(",").length - 1 && " |"}
                  </span>
                ))}
            </p>
          </div>

          <span>{user.connections ? user.connections : 0}+ Connections</span>

          {currUser.id === user.id && (
            <Button
              onClick={() => navigate(`/edit-profile/${user.id}`)}
              className="ms-4"
              variant="info"
            >
              <i className="fa-solid fa-user-edit"></i> Edit Profile
            </Button>
          )}
        </div>
      </Card>

      <Row className="px-5">
        <Col md={6}>
          <Goals
            user={user}
            goals={goals}
            setGoals={setGoals}
            loadGoals={loadGoals}
            renderViewAll={false}
            isSameUser={currUser.id === user.id}
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
    </div>
  );
};

export default Profile;
