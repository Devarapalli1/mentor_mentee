import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate, useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { db } from "../firebase/config";
import { get, ref, update } from "firebase/database";

const EditProfile = ({ user, setUser }) => {
  const { id } = useParams(); // Get user ID from the URL
  const [form, setForm] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
    role: "",
    skills: "", // Add skills to form state
  });
  const [alert, setAlert] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    // Load current user data to pre-fill the form
    const loadUserData = async () => {
      try {
        const userRef = ref(db, `users/${id}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setForm({
            username: userData.username,
            email: userData.email,
            dateOfBirth: userData.dateOfBirth,
            role: userData.role,
            skills: userData.skills || "", // Initialize skills
          });
        } else {
          setAlert("User data not found");
        }
      } catch (error) {
        setAlert("Error fetching user data: " + error.message);
      }
    };

    loadUserData();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onRoleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert("");

    if (!form.username.trim()) {
      setAlert("Please enter a User Name");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setAlert("Please enter a valid Email");
      return;
    }

    if (!form.dateOfBirth) {
      setAlert("Please enter your Date Of Birth");
      return;
    }

    if (!form.role) {
      setAlert("Please select a Role (Mentor or Mentee)");
      return;
    }

    if (!form.skills.trim()) {
      // Validate skills
      setAlert("Please enter your Skills (mandatory)");
      return;
    }

    try {
      const userRef = ref(db, `users/${id}`);
      await update(userRef, {
        username: form.username,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        role: form.role,
        skills: form.skills, // Save skills as an array
      });

      // Update current user state
      if (user?.id === id) {
        setUser((prevUser) => ({
          ...prevUser,
          username: form.username,
          email: form.email,
          dateOfBirth: form.dateOfBirth,
          role: form.role,
          skills: form.skills, // Update skills in user state
        }));
      }

      setRedirect(true);
    } catch (error) {
      setAlert("Update failed: " + error.message);
    }
  };

  if (redirect) {
    return <Navigate to={`/profile/${id}`} />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="d-flex justify-content-around align-items-center vw-100 vh-100 register ">
        <Card className="shadow p-3 pt-0 mb-5 bg-body rounded d-flex justify-content-center align-items-center register-card">
          <Card.Title className="primary-color">Edit Profile</Card.Title>

          <br />

          {alert && (
            <Alert variant="danger" className="w-100 p-2">
              <em
                className="fa-solid fa-triangle-exclamation me-2"
                style={{ color: "red" }}
              ></em>
              {alert}
            </Alert>
          )}

          <Form.Group className="my-2 w-75" controlId="username">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              name="username"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              value={form.username}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              value={form.email}
              onChange={onChange}
              disabled
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="dateofbirth">
            <Form.Label>Date Of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              value={form.dateOfBirth}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="skills">
            <Form.Label>Skills (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              name="skills"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              placeholder="Enter skills separated by commas"
              value={form.skills}
              onChange={onChange}
            />
          </Form.Group>

          <br />

          <Button
            variant="primary"
            className="bg-primary border-0 w-50"
            type="submit"
          >
            Save Changes
          </Button>
        </Card>
      </div>
    </Form>
  );
};

export default EditProfile;
