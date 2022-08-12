import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAppSelector } from '../../app/hooks';
import { dragonflyExporter } from '../../data/exports/dragonfly/dragonfly-exporter';
import {
  DRAGONFLY,
  getExportFileName,
  JSON,
} from '../../data/exports/export-type';
import { jsonExporter } from '../../data/exports/json-exporter';
import { simpleSaveFile } from '../../data/exports/simple-save-file';

export const Navigation = () => {
  const actions = useAppSelector((state) => state.action.saved);
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const roleKeys = useAppSelector((state) => state.roleKey.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const specs = useAppSelector((state) => state.spec.saved);
  const variables = useAppSelector((state) => state.variable.saved);
  const exportJson = (_e: React.MouseEvent<HTMLElement>) => {
    const data = jsonExporter.export(
      actions,
      commands,
      contexts,
      roleKeys,
      selectors,
      specs,
      variables
    );
    simpleSaveFile(data[0], getExportFileName(JSON));
  };
  const exportDragonfly = (_e: React.MouseEvent<HTMLElement>) => {
    const data = dragonflyExporter.export(
      actions,
      commands,
      contexts,
      roleKeys,
      selectors,
      specs,
      variables
    );
    simpleSaveFile(data[0], getExportFileName(DRAGONFLY));
  };
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
              <NavDropdown.Item href="#action/3.4" onClick={exportJson}>
                Export Element Set
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.5" disabled>
                Export Caster
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.6" onClick={exportDragonfly}>
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
