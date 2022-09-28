import React, { useContext, useId, useRef } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {
  DRAGONFLY,
  getExportFileName,
  JSON,
} from '../../../data/exports/export-type';
import { simpleSaveFile } from '../../../data/exports/simple-save-file';
import { DeserializationResultType } from '../../../data/imports/deserialization-result';
import { useAllData } from '../../../app/custom-hooks/use-all-data-hook';
import { InjectionContext } from '../../../di/injector-context';
import { ImportValidationResultType } from '../../../data/imports/imports-validator';
import { Tokens } from '../../../di/config/brandi-tokens';

export const Navigation: React.FC<{}> = () => {
  const allData = useAllData();
  const container = useContext(InjectionContext);
  const importInputId = useId();
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const exportJson = () => {
    const jsonExporter = container.get(Tokens.JsonExporter);
    const data = jsonExporter.export(allData);
    simpleSaveFile(data[0], getExportFileName(JSON));
  };
  const exportDragonfly = () => {
    const dragonflyExporter = container.get(Tokens.DragonflyExporter);
    const data = dragonflyExporter.export(allData);
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
      const deserializer = container.get(Tokens.Deserializer);
      const dataMerger = container.get(Tokens.DataMerger);
      const cleaner = container.get(Tokens.ImportsCleaner);
      const validator = container.get(Tokens.ImportsValidator);

      //
      const deserializationResult = deserializer.deserialize(fileContents);
      if (deserializationResult.type === DeserializationResultType.VALID) {
        // TODO: version adapters
        const merged = dataMerger.merge(allData, deserializationResult.data);
        const cleaned = cleaner.cleanData(merged);
        const validationResult = validator.validateImportedData(cleaned);
        if (validationResult.status === ImportValidationResultType.VALID) {
          // TODO: add it to redux
        }
      }
      // TODO: error toast "Import Failed - See Logs" and log results
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
