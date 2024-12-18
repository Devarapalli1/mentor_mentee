import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const Register = ({ user, setUser, loginUser }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (user?.email) {
    return <Navigate to="/" />;
  }

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

    if (form.password.length < 6) {
      setAlert("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setAlert("Passwords do not match");
      return;
    }

    try {
      const dbRef = ref(db, "users");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const emailInUse = Object.values(users).some(
          (user) => user.email === form.email
        );

        if (emailInUse) {
          setAlert("The email address you entered is already in use.");
          return;
        }
      }

      const newDocRef = push(ref(db, "users"));
      await set(newDocRef, {
        username: form.username,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        role: form.role,
        password: form.password,
        rating: 5,
        connections: 0,
      });

      await loginUser(form.email, form.password);
      if (user?.email && user?.id) {
        setRedirect(true);
      }
    } catch (error) {
      setAlert("Registration failed: " + error.message);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <Form onSubmit={onSubmit} aria-label="User Registration Form">
      <div className="d-flex justify-content-around align-items-center vw-100 vh-100 register pt-5">
        <div>
          <img
            src="img/Register.png"
            alt="Illustration for registration process"
            className="register-image"
          />
        </div>
        <Card className="shadow p-3 mb-5 bg-body rounded d-flex justify-content-center align-items-center register-card">
          <Card.Title className="primary-color">Register</Card.Title>

          <br />

          {alert && (
            <Alert variant="danger" className="w-100 p-2">
              <em
                className="fa-solid fa-triangle-exclamation me-2"
                aria-hidden="true"
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
              aria-required="true"
              aria-label="Enter your user name"
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
              aria-required="true"
              aria-label="Enter your email address"
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
              aria-required="true"
              aria-label="Enter your date of birth"
            />
          </Form.Group>

          <fieldset className="my-2 w-75">
            <legend className="form-label">Role</legend>
            <div className="d-flex justify-content-between">
              <Form.Check
                type="radio"
                id="Mentor"
                name="role"
                value="Mentor"
                checked={form.role === "Mentor"}
                onChange={onRoleChange}
                label="Mentor"
                aria-required="true"
                aria-label="Select Mentor as role"
              />

              <Form.Check
                type="radio"
                id="Mentee"
                name="role"
                value="Mentee"
                checked={form.role === "Mentee"}
                onChange={onRoleChange}
                label="Mentee"
                aria-label="Select Mentee as role"
              />
            </div>
          </fieldset>

          <Form.Group className="my-2 w-75" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              value={form.password}
              onChange={onChange}
              aria-required="true"
              aria-label="Enter your password"
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="confirmpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              value={form.confirmPassword}
              onChange={onChange}
              aria-required="true"
              aria-label="Confirm your password"
            />
          </Form.Group>

          <br />

          <Button
            variant="primary"
            className="bg-primary border-0 w-50"
            type="submit"
            aria-label="Submit Registration Form"
          >
            Signup
          </Button>

          <Card.Link
            href="/login"
            className="primary-color my-2"
            aria-label="Link to login page"
          >
            Have an account? Login here!
          </Card.Link>
        </Card>
      </div>
    </Form>
  );
};

export default Register;
