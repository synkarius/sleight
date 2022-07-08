import React, { useId } from 'react';
import { Button, FormControl, FormGroup, FormText, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { VerticalMoveableComponent } from '../../ui/VerticalMoveableComponent';
import { ActionDropdownComponent } from '../action/ActionDropdownComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { SpecDropdownComponent } from '../spec/SpecDropdownComponent';
import { Command, MoveCommandActionPayload } from './command';
import {
  addActionToEditingCommand,
  changeEditingCommandActionId,
  changeEditingCommandName,
  changeEditingCommandRoleKey,
  changeEditingCommandSpecRoleKeyId,
  changeEditingCommandSpecSpecId,
  changeEditingCommandSpecType,
  clearEditingCommand,
  deleteEditingCommandAction,
  moveEditingCommandAction,
  saveEditingCommand,
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
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingCommand());
    dispatch(clearEditingCommand());
  };

  return (
    <PanelComponent header="Create/Edit Command">
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
        <VerticalMoveableComponent<MoveCommandActionPayload, number>
          moveFn={(direction) =>
            moveEditingCommandAction({ index: index, direction: direction })
          }
          deleteFn={() => deleteEditingCommandAction(index)}
          key={actionId + '-' + index}
        >
          <ActionDropdownComponent
            actionId={actionId}
            selectedChangedFn={(newActionId) =>
              changeEditingCommandActionId({
                index: index,
                newActionId: newActionId,
              })
            }
          />
        </VerticalMoveableComponent>
      ))}
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
