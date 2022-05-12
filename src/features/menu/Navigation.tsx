import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export const Navigation = () => {
    return <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
            <Navbar.Brand href="#home">🧙‍♂️ Sleight</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title="File" id="file-dropdown">
                        <NavDropdown.Item href="#action/3.1">New Element Set</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.2">Open Element Set</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.3">Import Element Set</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.4">Export Element Set</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.5">Export Caster</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.6">Export Dragonfly</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.7">Export Talon</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.8">Export Vocola 3</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Edit" id="edit-dropdown">
                        <NavDropdown.Item href="#action/4.1">Duplicate Selected Element</NavDropdown.Item>
                        <NavDropdown.Item href="#action/4.2">Delete Selected Element</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/4.1">Preferences</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Help" id="help-dropdown">
                        <NavDropdown.Item href="#action/5.1">Documentation</NavDropdown.Item>
                        <NavDropdown.Item href="#action/5.2">Release Notes</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/5.3">View License</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/5.4">About</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}