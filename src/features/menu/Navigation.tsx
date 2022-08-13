import React, { useContext, useId, useRef } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAppSelector } from '../../app/hooks';
import {
  DRAGONFLY,
  getExportFileName,
  JSON,
} from '../../data/exports/export-type';
import { simpleSaveFile } from '../../data/exports/simple-save-file';
import { ImportResultType } from '../../data/imports/import-result';
import { InjectionContext } from '../../di/injector-context';

export const Navigation = () => {
  const actions = useAppSelector((state) => state.action.saved);
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const roleKeys = useAppSelector((state) => state.roleKey.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const specs = useAppSelector((state) => state.spec.saved);
  const variables = useAppSelector((state) => state.variable.saved);
  const injectionContext = useContext(InjectionContext);
  const importInputId = useId();
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const exportJson = () => {
    const data = injectionContext.exporters.json.export({
      actions: Object.values(actions),
      commands: Object.values(commands),
      contexts: Object.values(contexts),
      roleKeys: Object.values(roleKeys),
      selectors: Object.values(selectors),
      specs: Object.values(specs),
      variables: Object.values(variables),
    });
    simpleSaveFile(data[0], getExportFileName(JSON));
  };
  const exportDragonfly = () => {
    const data = injectionContext.exporters.dragonfly.export({
      actions: Object.values(actions),
      commands: Object.values(commands),
      contexts: Object.values(contexts),
      roleKeys: Object.values(roleKeys),
      selectors: Object.values(selectors),
      specs: Object.values(specs),
      variables: Object.values(variables),
    });
    simpleSaveFile(data[0], getExportFileName(DRAGONFLY));
  };
  const importFileClickHandler = () => {
    importInputRef.current?.click();
  };
  const importFileChangeHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files?.item(0);
    const fileContents = await file?.text();
    if (fileContents) {
      const importResult = injectionContext.importers.json.import(fileContents);
      if (importResult.type === ImportResultType.VALID) {
        // TODO: version adapters
        // TODO: add it to redux
      }
    }
  };
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <input
        type="file"
        id={importInputId}
        ref={importInputRef}
        style={{ display: 'none' }}
        onChange={importFileChangeHandler}
      />
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
              <NavDropdown.Item
                href="#action/3.3"
                onClick={importFileClickHandler}
              >
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
                Export Vocola 2
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
