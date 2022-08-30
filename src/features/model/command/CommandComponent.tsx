import React, { useContext } from 'react';
import { Button, Col, FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { VerticalMoveableComponent } from '../../ui/VerticalMoveableComponent';
import { ActionDropdownComponent } from '../action/ActionDropdownComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { SpecDropdownComponent } from '../spec/SpecDropdownComponent';
import { Command } from './command';
import {
  CommandEditingContext,
  CommandReducerActionType,
} from './command-editing-context';
import { saveEditingCommand } from './command-reducers';
import { CommandSpecType } from './command-spec-type';
import { CommandSpecTypeRadioGroupComponent } from './CommandSpecTypeRadioGroupComponent';
import { ContextDropdownComponent } from '../context/ContextDropdownComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { InjectionContext } from '../../../di/injector-context';
import { ErrorTextComponent } from '../../ui/ErrorTextComponent';

export const CommandComponent: React.FC<{ command: Command }> = (props) => {
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(CommandEditingContext);
  const injectionContext = useContext(InjectionContext);
  const commandDefaultNamer = injectionContext.default.namers.command;

  const nameChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: CommandReducerActionType.CHANGE_NAME,
      payload: e.target.value,
    });
    validationContext.touch(Field.CMD_NAME);
  };
  const roleKeyChangedHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatchFn({
      type: CommandReducerActionType.CHANGE_ROLE_KEY,
      payload: e.target.value,
    });
  };
  const addActionHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    const actions = Object.values(actionsSaved);
    if (actions.length > 0) {
      editingContext.localDispatchFn({
        type: CommandReducerActionType.ADD_ACTION,
      });
    }
  };
  const submitHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForm();
    if (formIsValid) {
      reduxDispatch(saveEditingCommand(props.command));
      reduxDispatch(setEditorFocus());
    }
  };
  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const specFields = {
    radio: Field.CMD_SPEC_RADIO,
    variable: Field.CMD_SPEC_SPEC_SELECT,
    roleKey: Field.CMD_SPEC_RK_SELECT,
  };
  const nameError = errorResults([Field.CMD_NAME]);
  const specTypeErrorMessage = errorResults([
    specFields.variable,
    specFields.roleKey,
  ]);
  const onSaveErrorMessage = errorResults([Field.CMD_SAVE]);

  return (
    <PanelComponent header="Create/Edit Command">
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
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          field={Field.CMD_ROLE_KEY}
          roleKeyId={props.command.roleKeyId}
          onChange={roleKeyChangedHandler}
        />
        <FormText className="text-muted">role of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Context">
        <ContextDropdownComponent
          field={Field.CMD_CONTEXT}
          contextId={props.command.contextId}
          onChange={(e) => {
            editingContext.localDispatchFn({
              type: CommandReducerActionType.CHANGE_CONTEXT,
              payload: e.target.value,
            });
          }}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Spec Type"
        required={true}
        errorMessage={specTypeErrorMessage}
      >
        <CommandSpecTypeRadioGroupComponent
          commandSpecType={props.command.specType}
          radioGroupName={Field[specFields.radio]}
          typeChangedFn={(value) => {
            editingContext.localDispatchFn({
              type: CommandReducerActionType.CHANGE_SPEC_TYPE,
              payload: value as CommandSpecType.Type,
            });
            validationContext.touch(specFields.radio);
          }}
        />
        {props.command.specType === CommandSpecType.Enum.SPEC && (
          <SpecDropdownComponent
            field={specFields.variable}
            specId={props.command.specId}
            onChange={(e) => {
              editingContext.localDispatchFn({
                type: CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID,
                payload: e.target.value,
              });
              validationContext.touch(specFields.variable);
            }}
            onBlur={(_e) => validationContext.touch(specFields.variable)}
            isInvalid={!!errorResults([specFields.variable])}
          />
        )}
        {props.command.specType === CommandSpecType.Enum.ROLE_KEY && (
          <RoleKeyDropdownComponent
            field={specFields.roleKey}
            roleKeyId={props.command.specRoleKeyId}
            onChange={(e) => {
              editingContext.localDispatchFn({
                type: CommandReducerActionType.CHANGE_SPEC_ROLE_KEY_ID,
                payload: e.target.value,
              });
              validationContext.touch(specFields.roleKey);
            }}
            onBlur={(_e) => validationContext.touch(specFields.roleKey)}
            isInvalid={!!errorResults([specFields.roleKey])}
          />
        )}
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
          moveFn={(direction) => {
            editingContext.localDispatchFn({
              type: CommandReducerActionType.MOVE_ACTION,
              payload: { index: index, direction: direction },
            });
          }}
          deleteFn={() => {
            editingContext.localDispatchFn({
              type: CommandReducerActionType.DELETE_ACTION,
              payload: index,
            });
          }}
          key={actionId + '-' + index}
        >
          <ActionDropdownComponent
            field={Field.CMD_ACTION_SELECT}
            actionId={actionId}
            onChange={(e) => {
              editingContext.localDispatchFn({
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
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={fullErrorResults.length > 0}
      >
        Save
      </Button>
      <Button
        onClick={(_e) => reduxDispatch(setEditorFocus())}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
