import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export const Navigation = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home">🧙‍♂️ Sleight</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="File" id="file-dropdown">
              <NavDropdown.Item href="#action/3.1" disabled>
                New Element Set
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2" disabled>
                Open Element Set
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3" disabled>
                Import Element Set
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4" disabled>
                Export Element Set
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.5" disabled>
                Export Caster
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.6" disabled>
                Export Dragonfly
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.7" disabled>
                Export Talon
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.8" disabled>
                Export Vocola 3
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Edit" id="edit-dropdown">
              <NavDropdown.Item href="#action/4.1" disabled>
                Duplicate Selected Element
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/4.2" disabled>
                Delete Selected Element
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/4.3" disabled>
                Preferences
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="View" id="view-dropdown">
              <NavDropdown.Item href="#action/6.1">
                Editor Mode
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/6.2" disabled>
                Wizard Mode
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Help" id="help-dropdown">
              <NavDropdown.Item href="#action/5.1" disabled>
                Documentation
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/5.2" disabled>
                Release Notes
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/5.3" disabled>
                View License
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/5.4" disabled>
                About
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
