import React from 'react';
import { Button, Form, FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKey } from './role-key';
import {
  changeEditingRoleKeyValue,
  clearEditingRoleKey,
  saveAndClearEditingRoleKey,
  validateRoleKeyText,
} from './role-key-reducers';
import { roleKeyTextValidator } from './role-key-validation';

export const RoleKeyComponent: React.FC<{ roleKey: RoleKey }> = (props) => {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(
    (state) => state.roleKey.validationErrors
  );

  const valueChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingRoleKeyValue(event.target.value));
    dispatch(validateRoleKeyText());
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(validateRoleKeyText());
    dispatch(saveAndClearEditingRoleKey());
  };

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
          onBlur={(_e) => dispatch(validateRoleKeyText())}
          value={props.roleKey.value}
          isInvalid={validationErrors.includes(roleKeyTextValidator.error)}
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
        onClick={(_e) => dispatch(clearEditingRoleKey())}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
