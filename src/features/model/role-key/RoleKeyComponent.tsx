import React, { useContext } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { setFocus } from '../../menu/focus/focus-reducers';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKey } from './role-key';
import {
  RoleKeyReducerActionType,
  RoleKeyEditingContext,
} from './role-key-editing-context';
import { saveRoleKey } from './role-key-reducers';
import { roleKeyTextValidator } from './role-key-validation';

export const RoleKeyComponent: React.FC<{ roleKey: RoleKey }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(RoleKeyEditingContext);

  const valueChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: RoleKeyReducerActionType.CHANGE_VALUE,
      payload: event.target.value,
    });
    validationContext.touch(Field.RK_ROLE_KEY);
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForm();
    if (formIsValid) {
      reduxDispatch(saveRoleKey(props.roleKey));
      reduxDispatch(setFocus(undefined));
    }
  };

  const validationErrors = validationContext.getErrors();
  return (
    <PanelComponent header="Create/Edit Role Key">
      <FormGroupRowComponent
        labelText="Role"
        descriptionText="what concept this key identifies"
        required={true}
      >
        <FormControl
          type="text"
          onChange={valueChangedHandler}
          onBlur={(_e) => validationContext.touch(Field.RK_ROLE_KEY)}
          value={props.roleKey.value}
          isInvalid={validationErrors.includes(roleKeyTextValidator.error)}
          role="textbox"
          aria-label={Field[Field.RK_ROLE_KEY]}
        />
        <Form.Control.Feedback type="invalid">
          {roleKeyTextValidator.error.message}
        </Form.Control.Feedback>
      </FormGroupRowComponent>
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
