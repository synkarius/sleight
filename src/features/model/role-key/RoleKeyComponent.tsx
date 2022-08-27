import React, { useContext } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKey } from './role-key';
import {
  RoleKeyReducerActionType,
  RoleKeyEditingContext,
} from './role-key-editing-context';
import { saveRoleKey } from './role-key-reducers';

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
      reduxDispatch(setEditorFocus());
    }
  };

  const errorResults = processErrorResults(validationContext.getErrorResults());
  const roleKeyField = Field.RK_ROLE_KEY;
  const roleKeyError = errorResults([roleKeyField]);

  return (
    <PanelComponent header="Create/Edit Role Key">
      <FormGroupRowComponent
        labelText="Role"
        descriptionText="what concept this key identifies"
        required={true}
        errorMessage={roleKeyError}
      >
        <FormControl
          type="text"
          onChange={valueChangedHandler}
          onBlur={(_e) => validationContext.touch(roleKeyField)}
          value={props.roleKey.value}
          isInvalid={!!roleKeyError}
          role="textbox"
          aria-label={Field[roleKeyField]}
        />
      </FormGroupRowComponent>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={!!roleKeyError}
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
