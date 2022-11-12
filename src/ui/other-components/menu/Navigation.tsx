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
import { Tokens } from '../../../di/config/brandi-tokens';
import { useAppDispatch } from '../../../app/hooks';
import { setActions } from '../../../core/reducers/action-reducers';
import { setCommands } from '../../../core/reducers/command-reducers';
import { setContexts } from '../../../core/reducers/context-reducers';
import { setSelectors } from '../../../core/reducers/selector-reducers';
import { setSpecs } from '../../../core/reducers/spec-reducers';
import { setVariables } from '../../../core/reducers/variable-reducers';
import { useNavigate } from 'react-router-dom';
import {
  COMMAND_LIST_PATH,
  ELEMENT_EDITOR_PATH,
  PREFERENCES_PATH,
  RESOURCE_EDITOR_PATH,
  WIZARD_PATH,
} from '../../../core/common/consts';
import { setFns } from '../../../core/reducers/fn-reducers';
import { Stars } from 'react-bootstrap-icons';
import { CompositeValidationResultType } from '../../../data/composite-validators/composite-validation-result';

export const Navigation: React.FC<{}> = () => {
  const allData = useAllData();
  const reduxDispatch = useAppDispatch();
  const container = useContext(InjectionContext);
  const importInputId = useId();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const logger = container.get(Tokens.Logger);

  const newElementSet = () => {
    reduxDispatch(setActions({}));
    reduxDispatch(setCommands({}));
    reduxDispatch(setContexts({}));
    reduxDispatch(setFns({}));
    reduxDispatch(setSelectors({}));
    reduxDispatch(setSpecs({}));
    reduxDispatch(setVariables({}));
  };
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
    logger.info('import - reading file');
    const file = e.target.files?.item(0);
    const fileContents = await file?.text();
    if (fileContents) {
      logger.info('import - file read');
      const deserializer = container.get(Tokens.Deserializer);
      const dataMerger = container.get(Tokens.ImportDataMerger);
      const cleaner = container.get(Tokens.ImportsCleaner);
      const validator = container.get(Tokens.TotalDataCompositeValidator);

      //
      logger.info('import - deserializing json file');
      const deserializationResult = deserializer.deserialize(fileContents);
      if (deserializationResult.type === DeserializationResultType.VALID) {
        logger.info('import - deserialization successful');
        // TODO: version adapters
        const cleaned = cleaner.cleanData(deserializationResult.data);
        logger.info('import - cleaning successful');
        const merged = dataMerger.merge(allData, cleaned);
        logger.info('import - merge successful');
        const validationResult = validator.validateSleightData(merged);
        if (validationResult.status === CompositeValidationResultType.VALID) {
          logger.info('import - validation result: valid');
          reduxDispatch(setActions(merged.actions));
          reduxDispatch(setCommands(merged.commands));
          reduxDispatch(setContexts(merged.contexts));
          reduxDispatch(setFns(merged.fns));
          reduxDispatch(setSelectors(merged.selectors));
          reduxDispatch(setSpecs(merged.specs));
          reduxDispatch(setVariables(merged.variables));
          logger.info('import - saved');
          return;
        } else {
          logger.warn('import - validation result: invalid');
          validationResult.invalidated
            .map(
              (invalid) =>
                `import - id: ${invalid.id} ; reason: ${invalid.message}`
            )
            .forEach((msg) => logger.warn(msg));
        }
      } else {
        // TODO: error toast "Import Failed - See Logs"
        logger.error('import - deserialization failure');
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
        <Navbar.Brand>
          <Stars /> Sleight
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="File" id="file-dropdown">
              <NavDropdown.Item onClick={newElementSet}>
                New Collection
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={importFileClickHandler}>
                Import Collection
              </NavDropdown.Item>
              <NavDropdown.Item onClick={exportJson}>
                Export Collection
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item disabled>Export Caster</NavDropdown.Item>
              <NavDropdown.Item onClick={exportDragonfly}>
                Export Dragonfly
              </NavDropdown.Item>
              <NavDropdown.Item disabled>Export Talon</NavDropdown.Item>
              <NavDropdown.Item disabled>Export Vocola 2</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Edit" id="edit-dropdown">
              <NavDropdown.Item onClick={() => navigate(PREFERENCES_PATH)}>
                Preferences
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="View" id="view-dropdown">
              <NavDropdown.Item onClick={() => navigate(COMMAND_LIST_PATH)}>
                Command List
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate(ELEMENT_EDITOR_PATH)}>
                Element Editor
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate(RESOURCE_EDITOR_PATH)}>
                Resource Editor
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate(WIZARD_PATH)}>
                Wizard
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Help" id="help-dropdown">
              <NavDropdown.Item disabled>Documentation</NavDropdown.Item>
              <NavDropdown.Item disabled>Release Notes</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item disabled>View License</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item disabled>About</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
