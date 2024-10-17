import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

const Login = ({ user, setUser }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (user?.email) {
    return <Navigate to="/" />;
  }

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emptyTextRegex = /^\s*$/;

    setAlert("");

    if (!emailRegex.test(form.email.trim())) {
      setAlert("Please enter a valid Email");
      return;
    }

    if (emptyTextRegex.test(form.password.trim())) {
      setAlert("Please enter a Password");
      return;
    }

    setUser({
      ...user,
      email: form.email,
      password: form.password,
    });
    setAlert("");
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/dashboard" />;
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

          {alert && (
            <Alert variant="danger" className="w-100 p-2">
              <i
                className="fa-solid fa-triangle-exclamation me-2"
                style={{ color: "red" }}
              ></i>
              {alert}
            </Alert>
          )}

          <Form.Group
            className="mb-3 w-75"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              value={form.email}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 w-75"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={onChange}
            />
          </Form.Group>

          <br />

          <Button
            variant="primary"
            className="bg-primary border-0 w-50"
            onClick={onSubmit}
          >
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
