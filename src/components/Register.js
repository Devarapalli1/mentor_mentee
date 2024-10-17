import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";

const Register = (user, setUser) => {
  if (user?.name) {
    <Navigate to="/login" />;
  }

  return (
    <Form>
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

          <Form.Group className="my-2 w-75" controlId="username">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              className="border-0 border-bottom border-2 rounded-0 p-0"
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              className="border-0 border-bottom border-2 rounded-0 p-0"
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="dateofbirth">
            <Form.Label>Date Of Birth</Form.Label>
            <Form.Control
              type="date"
              className="border-0 border-bottom border-2 rounded-0 p-0"
            />
          </Form.Group>

          <div className="d-flex justify-content-between my-2 w-75">
            <Form.Check type="radio" id="Mentor">
              <Form.Check.Input type="radio" />
              <Form.Check.Label>Mentor</Form.Check.Label>
            </Form.Check>

            <Form.Check type="radio" id="Mentee">
              <Form.Check.Input type="radio" />
              <Form.Check.Label>Mentee</Form.Check.Label>
            </Form.Check>
          </div>

          <Form.Group className="my-2 w-75" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="Password"
              className="border-0 border-bottom border-2 rounded-0 p-0"
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="confirmpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="Password"
              className="border-0 border-bottom border-2 rounded-0 p-0"
            />
          </Form.Group>

          <br />

          <Button variant="primary" className="bg-primary border-0 w-50" p-0>
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
