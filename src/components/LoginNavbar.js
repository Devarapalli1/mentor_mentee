import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavScrollExample() {
  return (
    <Navbar expand="lg" style={{ backgroundColor: "#005457" }}>
      <Container fluid>
        <Navbar.Brand href="/" className="w-50">
          <img src="logo.png" alt="Logo" style={{ width: "120px" }} />
        </Navbar.Brand>
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
                class="fa-solid fa-magnifying-glass"
                style={{ color: "#FFFFFF" }}
              ></i>
            </div>
          </Form>
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/register" style={{ color: "#FFFFFF" }}>
              Register <i class="fa-solid fa-right-to-bracket"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
