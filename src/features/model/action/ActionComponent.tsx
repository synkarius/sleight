import React from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Action } from './action';
import { ActionType } from './action-types';
import {
  changeEditingActionName,
  changeEditingActionRoleKey,
  changeEditingActionType,
  clearEditingAction,
  saveEditingAction,
} from './action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { SendKeyAction } from './send-key/send-key';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';

export const ActionComponent: React.FC<{ action: Action }> = (props) => {
  const dispatch = useAppDispatch();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingActionName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingActionType({ actionType: event.target.value }));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingAction());
    dispatch(clearEditingAction());
  };

  return (
    <PanelComponent header="Create/Edit Action">
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.action.name}
        />
        <FormText className="text-muted">name of action</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          roleKeyId={props.action.roleKeyId}
          onChange={(e) => dispatch(changeEditingActionRoleKey(e.target.value))}
        />
        <FormText className="text-muted">role of action</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type">
        <FormSelect
          aria-label="action type selection"
          onChange={typeChangedHandler}
          value={props.action.type}
        >
          {ActionType.values().map((ait) => (
            <option key={ait} value={ait}>
              {ait}
            </option>
          ))}
        </FormSelect>
        <FormText className="text-muted">kind of action</FormText>
      </FormGroupRowComponent>
      {props.action.type === ActionType.SEND_KEY && (
        <SendKeyComponent sendKeyAction={props.action as SendKeyAction} />
      )}
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
