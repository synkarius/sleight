import React, { useContext } from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { ActionType } from './action-types';
import { saveAction } from './action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { isSendKeyAction, SendKeyAction } from './send-key/send-key';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { ValidationContext } from '../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from './action-editing-context';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { Field } from '../../../validation/validation-field';
import { actionDefaultNamer } from './action-default-namer';
import { Action } from './action';
import { isMouseAction } from './mouse/mouse';
import { MouseComponent } from './mouse/MouseComponent';

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
      payload: event.target.value as ActionType.Type,
    });
    validationContext.touch(Field.AC_TYPE);
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
      reduxDispatch(setEditorFocus());
    }
  };

  const validationErrors = validationContext.getErrorResults();
  return (
    <PanelComponent header="Create/Edit Action">
      <FormGroupRowComponent labelText="Name">
        <FormControl
          aria-label={Field[Field.AC_NAME]}
          type="text"
          onChange={nameChangedHandler}
          value={props.action.name}
          placeholder={actionDefaultNamer.getDefaultName(props.action)}
        />
        <FormText className="text-muted">name of action</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          field={Field.AC_ROLE_KEY}
          roleKeyId={props.action.roleKeyId}
          onChange={roleKeyChangedHandler}
        />
        <FormText className="text-muted">role of action</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type" descriptionText="type of action">
        <FormSelect
          aria-label={Field[Field.AC_TYPE]}
          role="list"
          onChange={typeChangedHandler}
          value={props.action.type}
        >
          {ActionType.values().map((ait) => (
            <option key={ait} value={ait} role="listitem">
              {ait}
            </option>
          ))}
        </FormSelect>
      </FormGroupRowComponent>
      {isSendKeyAction(props.action) && (
        <SendKeyComponent sendKeyAction={props.action} />
      )}
      {isMouseAction(props.action) && (
        <MouseComponent mouseAction={props.action} />
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
