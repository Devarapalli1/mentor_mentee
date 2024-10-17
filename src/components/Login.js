import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";

const Login = (user, setUser) => {
  if (user?.name) {
    <Navigate to="/login" />;
  }

  return (
    <Form>
      <div className="d-flex justify-content-around align-items-center vw-100 vh-100 login">
        <div>
          <img src="img/Login.png" alt="Login" className="login-image" />
        </div>
        <Card className="shadow p-3 mb-5 bg-body rounded d-flex justify-content-center align-items-center login-card ">
          <Card.Title className="primary-color">LOGIN</Card.Title>

          <br />

          <Form.Group
            className="mb-3 w-75"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>

          <Form.Group
            className="mb-3 w-75"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control type="Password" placeholder="Password" />
          </Form.Group>

          <br />

          <Button variant="primary" className="bg-primary border-0 w-50">
            Submit
          </Button>

          <Card.Link href="/register" className="primary-color my-3">
            New? Sign Up here!
          </Card.Link>
        </Card>
      </div>
    </Form>
  );
};

export default Login;
