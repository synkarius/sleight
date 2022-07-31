import React, { useContext } from 'react';
import { Button, FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { getRelevantErrorMessage } from '../../../validation/field-validator';
import { setFocus } from '../../menu/focus/focus-reducers';
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
import { saveEditingCommand, selectCommand } from './command-reducers';
import { CommandSpecType } from './command-spec-type';
import { CommandSpecTypeRadioGroupComponent } from './CommandSpecTypeRadioGroupComponent';

export const CommandComponent: React.FC<{ command: Command }> = (props) => {
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(CommandEditingContext);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: CommandReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
  };
  const addActionHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const actions = Object.values(actionsSaved);
    if (actions.length > 0) {
      editingContext.localDispatchFn({
        type: CommandReducerActionType.ADD_ACTION,
        payload: actions[0].id,
      });
    }
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForm();
    if (formIsValid) {
      reduxDispatch(saveEditingCommand(props.command));
      reduxDispatch(selectCommand(undefined));
    }
  };
  const errorResults = validationContext.getErrorResults();
  const errorResultFields = errorResults.map((result) => result.field);
  const specFields = {
    radio: Field.CMD_SPEC_RADIO,
    variable: Field.CMD_SPEC_VAR,
    roleKey: Field.CMD_SPEC_RK,
  };
  const commandSpecVariableIsInvalid = () =>
    errorResultFields.includes(specFields.variable);
  const commandSpecRoleKeyIsInvalid = () =>
    errorResultFields.includes(specFields.roleKey);
  const errorMessage = getRelevantErrorMessage(errorResults, [
    specFields.variable,
    specFields.roleKey,
  ]);

  return (
    <PanelComponent header="Create/Edit Command">
      <FormGroupRowComponent labelText="Name">
        <FormControl
          aria-label={Field[Field.CMD_NAME]}
          type="text"
          onChange={nameChangedHandler}
          value={props.command.name}
        />
        <FormText className="text-muted">name of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          field={Field.CMD_ROLE_KEY}
          roleKeyId={props.command.roleKeyId}
          onChange={(e) => {
            editingContext.localDispatchFn({
              type: CommandReducerActionType.CHANGE_ROLE_KEY,
              payload: e.target.value,
            });
          }}
        />
        <FormText className="text-muted">role of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Spec Type"
        required={true}
        errorMessage={errorMessage}
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
        {props.command.specType === CommandSpecType.Enum.VARIABLE && (
          <SpecDropdownComponent
            field={specFields.variable}
            specId={props.command.specVariableId}
            onChange={(e) => {
              editingContext.localDispatchFn({
                type: CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID,
                payload: e.target.value,
              });
              validationContext.touch(specFields.variable);
            }}
            onBlur={(_e) => validationContext.touch(specFields.variable)}
            isInvalid={commandSpecVariableIsInvalid()}
          />
        )}
        {props.command.specType === CommandSpecType.Enum.ROLE_KEY && (
          <RoleKeyDropdownComponent
            field={specFields.roleKey}
            roleKeyId={props.command.roleKeyId}
            onChange={(e) => {
              editingContext.localDispatchFn({
                type: CommandReducerActionType.CHANGE_SPEC_ROLE_KEY_ID,
                payload: e.target.value,
              });
              validationContext.touch(specFields.roleKey);
            }}
            onBlur={(_e) => validationContext.touch(specFields.roleKey)}
            isInvalid={commandSpecRoleKeyIsInvalid()}
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
            actionId={actionId}
            onChange={(e) => {
              editingContext.localDispatchFn({
                type: CommandReducerActionType.CHANGE_ACTION,
                payload: {
                  index: index,
                  newActionId: e.target.value,
                },
              });
            }}
          />
        </VerticalMoveableComponent>
      ))}
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={errorResults.length > 0}
      >
        Save
      </Button>
      <Button
        onClick={(_e) => reduxDispatch(setFocus(undefined))}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
