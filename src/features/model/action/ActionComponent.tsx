import React from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Action } from './action';
import { ActionType } from './action-types';
import {
  changeEditingActionName,
  changeEditingActionRoleKey,
  changeEditingActionType,
  saveAndClearEditingAction,
  validateKeyToSend,
} from './action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { SendKeyAction } from './send-key/send-key';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';

export const ActionComponent: React.FC<{ action: Action }> = (props) => {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(
    (state) => state.action.validationErrors
  );

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingActionName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingActionType({ actionType: event.target.value }));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    /*
     * The problem here is that we want to be able to (A) know what's on the screen
     * and (B) which errors correspond to those elements when either submitting
     * or disabling the save button.
     */
    [validateKeyToSend].forEach((validation) => dispatch(validation()));
    dispatch(saveAndClearEditingAction());
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
      <FormGroupRowComponent labelText="Type" descriptionText="type of action">
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
      </FormGroupRowComponent>
      {props.action.type === ActionType.SEND_KEY && (
        <SendKeyComponent sendKeyAction={props.action as SendKeyAction} />
      )}
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={validationErrors.length > 0}
      >
        Save
      </Button>
    </PanelComponent>
  );
};
