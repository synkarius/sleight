import React, { useContext } from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Action } from './action';
import { ActionType } from './action-types';
import { saveAction } from './action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { SendKeyAction } from './send-key/send-key';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { ValidationContext } from '../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from './action-editing-context';
import { setFocus } from '../../menu/focus/focus-reducers';

export const ActionComponent: React.FC<{ action: Action }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_TYPE,
      payload: event.target.value,
    });
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForm();
    if (formIsValid) {
      reduxDispatch(saveAction(props.action));
      reduxDispatch(setFocus(undefined));
    }
  };

  const validationErrors = validationContext.getErrors();
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
          onChange={roleKeyChangedHandler}
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
