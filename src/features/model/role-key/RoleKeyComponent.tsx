import React from 'react';
import { Button, Form, FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKey } from './role-key';
import {
  changeEditingRoleKeyValue,
  saveAndClearEditingRoleKey,
  validateRoleKeyText,
} from './role-key-reducers';
import { RoleKeyValidationError } from './role-key-validation';

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
      <FormGroupRowComponent labelText="Role">
        <FormControl
          type="text"
          onChange={valueChangedHandler}
          onBlur={(_e) => dispatch(validateRoleKeyText())}
          value={props.roleKey.value}
          isInvalid={validationErrors.includes(
            RoleKeyValidationError.ROLE_KEY_IS_EMPTY
          )}
        />
        <FormText className="text-muted">
          what concept this key identifies
        </FormText>
        <Form.Control.Feedback type="invalid">
          {RoleKeyValidationError.ROLE_KEY_IS_EMPTY.toString()}
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
    </PanelComponent>
  );
};
