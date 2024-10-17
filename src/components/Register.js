import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

const Register = ({ user, setUser }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
    role: "", // Initialize role as an empty string
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (user?.name) {
    return <Navigate to="/login" />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onRoleChange = (e) => {
    // Set the role based on the selected radio button value
    setForm((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setAlert("");

    // Validation
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

    // Set user information
    setUser({
      ...user,
      username: form.username,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      role: form.role,
      password: form.password,
    });
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <Form onSubmit={onSubmit}>
      {" "}
      {/* Use onSubmit handler */}
      <div className="d-flex justify-content-around align-items-center vw-100 vh-100 register pt-5">
        <div>
          <img
            src="img/Register.png"
            alt="Register"
            className="register-image"
          />
        </div>
        <Card className="shadow p-3 mb-5 bg-body rounded d-flex justify-content-center align-items-center register-card ">
          <Card.Title className="primary-color">Register</Card.Title>

          <br />

          {alert && ( // Display a single alert message
            <Alert variant="danger" className="w-100 p-2">
              <i
                className="fa-solid fa-triangle-exclamation me-2"
                style={{ color: "red" }}
              ></i>
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

          <div className="d-flex justify-content-between my-2 w-75">
            <Form.Check
              type="radio"
              id="Mentor"
              name="role"
              value="Mentor" // Set the value to "Mentor"
              checked={form.role === "Mentor"} // Check if this role is selected
              onChange={onRoleChange} // Use onChange to update role
              label="Mentor" // Label for the radio button
            />

            <Form.Check
              type="radio"
              id="Mentee"
              name="role"
              value="Mentee" // Set the value to "Mentee"
              checked={form.role === "Mentee"} // Check if this role is selected
              onChange={onRoleChange} // Use onChange to update role
              label="Mentee" // Label for the radio button
            />
          </div>

          <Form.Group className="my-2 w-75" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              className="border-0 border-bottom border-2 rounded-0 p-0"
              value={form.password}
              onChange={onChange}
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
            />
          </Form.Group>

          <br />

          <Button
            variant="primary"
            className="bg-primary border-0 w-50"
            type="submit" // Use type="submit"
          >
            Signup
          </Button>

          <Card.Link href="/login" className="primary-color my-2">
            Have an account? Login here!
          </Card.Link>
        </Card>
      </div>
    </Form>
  );
};

export default Register;
