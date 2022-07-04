import React, { useId } from 'react';
import { Button, FormControl, FormGroup, FormText, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { ActionDropdownComponent } from '../action/ActionDropdownComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { SpecDropdownComponent } from '../spec/SpecDropdownComponent';
import { Command } from './command';
import {
  addActionToEditingCommand,
  changeEditingCommandActionId,
  changeEditingCommandName,
  changeEditingCommandRoleKey,
  changeEditingCommandSpecRoleKeyId,
  changeEditingCommandSpecSpecId,
  changeEditingCommandSpecType,
  deleteEditingCommandAction,
} from './command-reducers';
import { CommandSpecType } from './command-spec-type';
import { CommandSpecTypeRadioGroupComponent } from './CommandSpecTypeRadioGroupComponent';

export const CommandComponent: React.FC<{ command: Command }> = (props) => {
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const dispatch = useAppDispatch();
  const actionsId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingCommandName(event.target.value));
  };
  const addActionHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const actions = Object.values(actionsSaved);
    if (actions.length > 0) {
      dispatch(addActionToEditingCommand(actions[0].id));
    }
  };

  return (
    <PanelComponent>
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.command.name}
        />
        <FormText className="text-muted">name of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          roleKeyId={props.command.roleKeyId}
          payloadFn={(id) => changeEditingCommandRoleKey(id)}
        />
        <FormText className="text-muted">role of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Spec Type">
        <CommandSpecTypeRadioGroupComponent
          commandSpecType={props.command.commandSpecType}
          radioGroupName="Spec Type"
          typeChangedFn={(value) => changeEditingCommandSpecType(value)}
        />
        {props.command.commandSpecType === CommandSpecType.SPEC && (
          <SpecDropdownComponent
            specId={props.command.specId}
            payloadFn={(id) => changeEditingCommandSpecSpecId(id)}
          />
        )}
        {props.command.commandSpecType === CommandSpecType.ROLE_KEY && (
          <RoleKeyDropdownComponent
            roleKeyId={props.command.roleKeyId}
            payloadFn={(id) => changeEditingCommandSpecRoleKeyId(id)}
          />
        )}
      </FormGroupRowComponent>
      <Button
        className="mb-3"
        onClick={addActionHandler}
        variant="outline-primary"
      >
        Add Action
      </Button>
      <FormGroup as={Row} className="mb-3" controlId={actionsId}>
        {props.command.actionIds.map((actionId, index) => (
          <ActionDropdownComponent
            key={actionId + '-' + index}
            actionId={actionId}
            selectedChangedFn={(newActionId) =>
              changeEditingCommandActionId({
                index: index,
                newActionId: newActionId,
              })
            }
            deletedFn={() => deleteEditingCommandAction(index)}
          />
        ))}
      </FormGroup>
    </PanelComponent>
  );
};
