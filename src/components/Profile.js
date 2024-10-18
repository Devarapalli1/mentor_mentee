import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import Goals from "./Goals";
import GoalsChart from "./GoalsChart";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { get, ref } from "firebase/database";

const Profile = ({ currUser }) => {
  const { id } = useParams(); // Extract user ID from the URL
  const [user, setUser] = useState(null); // State to store user data
  const [goals, setGoals] = useState([]);

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

  // Fetch user data from Firebase based on user ID
  useEffect(() => {
    async function fetchData() {
      await fetchUserData(); // Call the fetch function when the component mounts
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (user?.id !== null) {
      loadGoals();
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
              user.role
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD40po116YAeh-rRFht6E75O41HxxshP2UFw&s"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeFty9MSPvqt_0C1t8XMCRjj5sWycsXCQHlg&s"
            }
            alt="Mentor/Mentee"
          ></img>

          <div className="ml-4">
            <h4>
              {user.username}
              <span className="fw-normal h6 ms-5">{user.rating} ⭐</span>
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
        </div>
      </Card>

      <Row className="px-5">
        <Col md={6}>
          <Goals
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
