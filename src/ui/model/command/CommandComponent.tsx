import React, { useContext } from 'react';
import { Button, Col, FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { setEditorFocus } from '../../other-components/menu/editor/editor-focus-reducers';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { PanelComponent } from '../../other-components/PanelComponent';
import { VerticalMoveableComponent } from '../../other-components/VerticalMoveableComponent';
import { ActionDropdownComponent } from '../action/ActionDropdownComponent';
import { SpecDropdownComponent } from '../spec/SpecDropdownComponent';
import { Command } from '../../../data/model/command/command';
import {
  CommandEditingContext,
  CommandReducerActionType,
} from './command-editing-context';
import { saveCommand } from '../../../core/reducers/command-reducers';
import { ContextDropdownComponent } from '../context/ContextDropdownComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { InjectionContext } from '../../../di/injector-context';
import { ErrorTextComponent } from '../../other-components/ErrorTextComponent';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { ElementType } from '../../../data/model/element-types';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';

const CMD_ROLE_KEY = Field.CMD_ROLE_KEY;
const CMD_SPEC_SELECT = Field.CMD_SPEC_SELECT;

export const CommandComponent: React.FC<{ command: Command }> = (props) => {
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(CommandEditingContext);
  const injectionContext = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.COMMAND, props.command.id);
  const commandDefaultNamer = injectionContext.default.namers.command;

  const nameChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: CommandReducerActionType.CHANGE_NAME,
      payload: e.target.value,
    });
    validationContext.touch(Field.CMD_NAME);
  };
  const roleKeyChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: CommandReducerActionType.CHANGE_ROLE_KEY,
      payload: e.target.value,
    });
    validationContext.touch(Field.CMD_ROLE_KEY);
  };
  const toggleEnabled = () => {
    editingContext.localDispatch({
      type: CommandReducerActionType.TOGGLE_ENABLED,
    });
  };
  const toggleLocked = () => {
    editingContext.localDispatch({
      type: CommandReducerActionType.TOGGLE_LOCKED,
    });
  };
  const addActionHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    const actions = Object.values(actionsSaved);
    if (actions.length > 0) {
      editingContext.localDispatch({
        type: CommandReducerActionType.ADD_ACTION,
      });
    }
  };
  const submitHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForSave();
    if (formIsValid) {
      reduxDispatch(saveCommand(props.command));
      reduxDispatch(setEditorFocus());
    }
  };
  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const nameError = errorResults([Field.CMD_NAME]);
  const onSaveErrorMessage = errorResults([Field.CMD_SAVE]);

  return (
    <PanelComponent header="Create/Edit Command">
      <ExportImportOptionsComponent
        element={props.command}
        toggleEnabledFn={toggleEnabled}
        toggleLockedFn={toggleLocked}
      />
      <FormGroupRowComponent labelText="Name" errorMessage={nameError}>
        <FormControl
          aria-label={Field[Field.CMD_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.CMD_NAME)}
          isInvalid={!!nameError}
          value={props.command.name}
          placeholder={commandDefaultNamer.getDefaultName(props.command)}
        />
        <FormText className="text-muted">name of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of command"
        errorMessage={errorResults([CMD_ROLE_KEY])}
      >
        <FormControl
          aria-label={Field[CMD_ROLE_KEY]}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(CMD_ROLE_KEY)}
          isInvalid={!!errorResults([CMD_ROLE_KEY])}
          value={props.command.roleKey}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Context">
        <ContextDropdownComponent
          field={Field.CMD_CONTEXT}
          contextId={props.command.contextId}
          onChange={(e) => {
            editingContext.localDispatch({
              type: CommandReducerActionType.CHANGE_CONTEXT,
              payload: e.target.value,
            });
          }}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Spec"
        required={true}
        errorMessage={errorResults([CMD_SPEC_SELECT])}
      >
        <SpecDropdownComponent
          field={CMD_SPEC_SELECT}
          specId={props.command.specId}
          onChange={(e) => {
            editingContext.localDispatch({
              type: CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID,
              payload: e.target.value,
            });
            validationContext.touch(CMD_SPEC_SELECT);
          }}
          onBlur={(_e) => validationContext.touch(CMD_SPEC_SELECT)}
          isInvalid={!!errorResults([CMD_SPEC_SELECT])}
        />
      </FormGroupRowComponent>
      <div>
        <Button
          className="mb-3"
          onClick={addActionHandler}
          variant="outline-primary"
          size="lg"
        >
          Add Action
        </Button>
      </div>

      {props.command.actionIds.map((actionId, index) => (
        <VerticalMoveableComponent
          deleteField={Field.CMD_ACTION_DELETE}
          moveFn={(direction) => {
            editingContext.localDispatch({
              type: CommandReducerActionType.MOVE_ACTION,
              payload: { index: index, direction: direction },
            });
          }}
          deleteFn={() => {
            editingContext.localDispatch({
              type: CommandReducerActionType.DELETE_ACTION,
              payload: index,
            });
            validationContext.touch(Field.CMD_ACTION_DELETE);
          }}
          key={actionId + '-' + index}
        >
          <ActionDropdownComponent
            field={Field.CMD_ACTION_SELECT}
            actionId={actionId}
            onChange={(e) => {
              editingContext.localDispatch({
                type: CommandReducerActionType.CHANGE_ACTION,
                payload: {
                  index: index,
                  newActionId: e.target.value,
                },
              });
              validationContext.touch(Field.CMD_ACTION_SELECT);
            }}
            onBlur={() => validationContext.touch(Field.CMD_ACTION_SELECT)}
            isInvalid={!!errorResults([Field.CMD_ACTION_SELECT], actionId)}
          />
          <ErrorTextComponent
            errorMessage={errorResults([Field.CMD_ACTION_SELECT], actionId)}
          />
        </VerticalMoveableComponent>
      ))}
      <Col sm="12" className="mb-3">
        <ErrorTextComponent errorMessage={onSaveErrorMessage} />
      </Col>
      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
          aria-label={Field[Field.CMD_DELETE]}
        >
          Delete
        </Button>
      )}
      <Button
        onClick={(_e) => reduxDispatch(setEditorFocus())}
        className="me-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={fullErrorResults.length > 0}
      >
        Save
      </Button>
    </PanelComponent>
  );
};