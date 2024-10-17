import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import LoginNavbar from "./components/LoginNavbar";
import RegisterNavbar from "./components/RegisterNavbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: (
      <Fragment>
        <LoginNavbar />
        <Login />
      </Fragment>
    ),
  },
  {
    path: "/register",
    element: <RegisterNavbar />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
