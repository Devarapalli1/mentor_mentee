import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, Link } from "react-router-dom"; // Import Link

const NavBar = ({ user }) => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleViewProfile = () => {
    setDropdownVisible(false);
  };

  return (
    <Navbar
      expand="lg"
      className="position-absolute vw-100"
      style={{ backgroundColor: "#005457" }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="w-50">
          {" "}
          {/* Use Link for navigation */}
          <img src="/logo.png" alt="Logo" style={{ width: "120px" }} />
        </Navbar.Brand>

        {location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll" className="w-75">
                <Form className="d-flex me-auto mt-4 mt-md-0">
                  <Form.Control
                    type="search"
                    placeholder="Enter username"
                    className="me-auto rounded-pill"
                    aria-label="Enter username"
                  />
                  <div className="d-flex justify-content-center align-items-center ms-2">
                    <i
                      className="fa-solid fa-magnifying-glass"
                      style={{ color: "#FFFFFF" }}
                    ></i>
                  </div>
                </Form>
                <Nav className="me-2 my-2 my-lg-0" navbarScroll>
                  <Nav.Link
                    as={Link}
                    to="/goals" // Use Link
                    style={{ color: "#FFFFFF" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {location.pathname === "/goals" && (
                      <span className="text-decoration-underline">Goals</span>
                    )}
                    <i className="fa-solid fa-bullseye ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/notifications" // Use Link
                    style={{ color: "#FFFFFF" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {location.pathname === "/notifications" && (
                      <span className="text-decoration-underline">
                        Notifications
                      </span>
                    )}
                    <i className="fa-regular fa-bell ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/connections" // Use Link
                    style={{ color: "#FFFFFF" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {location.pathname === "/connections" && (
                      <span className="text-decoration-underline">
                        Connections
                      </span>
                    )}
                    <i className="fa-solid fa-link ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/forum" // Use Link
                    style={{ color: "#FFFFFF" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {location.pathname === "/forum" && (
                      <span className="text-decoration-underline">Forum</span>
                    )}
                    <i className="fa-solid fa-users ms-2"></i>
                  </Nav.Link>
                  <div className="position-relative">
                    <Nav.Link
                      style={{ color: "#FFFFFF", cursor: "pointer" }}
                      onClick={toggleDropdown}
                    >
                      <i className="fa-solid fa-circle-user"></i>
                    </Nav.Link>
                    {dropdownVisible && (
                      <div
                        className="position-absolute bg-light"
                        style={{
                          right: 0,
                          zIndex: 1000,
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          width: "200px",
                        }}
                      >
                        <Nav.Link
                          as={Link}
                          to={`/profile/${user.id}`}
                          style={{ color: "#000" }}
                          onClick={handleViewProfile}
                        >
                          View Profile
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to="/logout"
                          style={{ color: "#000" }}
                        >
                          Logout
                          <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </Nav.Link>
                      </div>
                    )}
                  </div>
                </Nav>
              </Navbar.Collapse>
            </>
          )}

        {location.pathname === "/login" && (
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/register" style={{ color: "#FFFFFF" }}>
              Register <i className="fa-solid fa-right-to-bracket"></i>
            </Nav.Link>
          </Nav>
        )}

        {location.pathname === "/register" && (
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/login" style={{ color: "#FFFFFF" }}>
              Login <i className="fa-solid fa-right-to-bracket"></i>
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
