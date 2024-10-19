import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, Link } from "react-router-dom"; // Import Link
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const NavBar = ({ user }) => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleViewProfile = () => {
    setDropdownVisible(false);
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const dbRef = ref(db, "users");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const tempUsers = Object.keys(users)
        .map((id) => ({ ...users[id], id }))
        .filter(
          (u) =>
            u.role !== user.role &&
            (u?.username?.toLowerCase().includes(query?.toLowerCase()) ||
              u?.skills?.toLowerCase().includes(query?.toLowerCase()))
        );
      setSearchResults(tempUsers);
    }
  };

  const closeSearchResults = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <Navbar
      expand="lg"
      className="position-absolute vw-100"
      style={{ backgroundColor: "#005457" }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="w-50">
          <img src="/logo.png" alt="Logo" style={{ width: "120px" }} />
        </Navbar.Brand>

        {location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll" className="w-75">
                <Form
                  className="d-flex me-auto mt-4 mt-md-0"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Form.Control
                    type="search"
                    placeholder={
                      user.role === "Mentor"
                        ? "Search for Mentees"
                        : "Search for Mentors with name or skill"
                    }
                    className="me-auto rounded-pill"
                    aria-label={
                      user.role === "Mentor"
                        ? "Search for Mentees"
                        : "Search for Mentors with name or skill"
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="d-flex justify-content-center align-items-center ms-2">
                    <i
                      className="fa-solid fa-magnifying-glass"
                      style={{ color: "#FFFFFF" }}
                    ></i>
                  </div>
                </Form>

                {searchResults.length > 0 && (
                  <div
                    className="position-absolute search-result-div bg-light"
                    style={{ zIndex: 1000 }}
                  >
                    {searchResults.map((result) => (
                      <div key={result.id} className="p-2 border-bottom">
                        <span>{result.username}</span>
                        <Link
                          to={`/profile/${result.id}`}
                          onClick={closeSearchResults}
                          className="btn btn-link"
                        >
                          <i class="fa-solid fa-eye"></i>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

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
