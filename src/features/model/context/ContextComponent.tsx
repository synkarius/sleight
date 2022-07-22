import React from 'react';
import {
  Button,
  Form,
  FormControl,
  FormSelect,
  FormText,
} from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Context } from './context';
import {
  changeEditingContextMatcher,
  changeEditingContextName,
  changeEditingContextRoleKey,
  changeEditingContextType,
  clearEditingContext,
  saveAndClearEditingContext,
  validateEditingContextMatcher,
} from './context-reducers';
import { ContextType } from './context-types';
import { contextMatcherValidator } from './context-validation';

export const ContextComponent: React.FC<{ context: Context }> = (props) => {
  const validationErrors = useAppSelector(
    (state) => state.context.validationErrors
  );
  const dispatch = useAppDispatch();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingContextName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingContextType(event.target.value));
  };
  const matcherChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeEditingContextMatcher(event.target.value));
    dispatch(validateEditingContextMatcher());
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(validateEditingContextMatcher());
    dispatch(saveAndClearEditingContext());
  };

  const matcherHelpText =
    props.context.type === ContextType.EXECUTABLE_NAME
      ? 'executable to match'
      : 'window title to match';

  return (
    <PanelComponent header="Create/Edit Context">
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.context.name}
        />
        <FormText className="text-muted">name of context</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          field={Field.CTX_ROLE_KEY}
          roleKeyId={props.context.roleKeyId}
          onChange={(e) =>
            dispatch(changeEditingContextRoleKey(e.target.value))
          }
        />
        <FormText className="text-muted">role of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type">
        <FormSelect
          aria-label="Variable type selection"
          onChange={typeChangedHandler}
          value={props.context.type}
        >
          {ContextType.values().map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </FormSelect>
        <FormText className="text-muted">kind of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Matcher"
        descriptionText={matcherHelpText}
        required={true}
      >
        <FormControl
          type="text"
          onChange={matcherChangedHandler}
          onBlur={(_e) => dispatch(validateEditingContextMatcher())}
          value={props.context.matcher}
          isInvalid={validationErrors.includes(contextMatcherValidator.error)}
        />
        <Form.Control.Feedback type="invalid">
          {contextMatcherValidator.error.message}
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
        onClick={(_e) => dispatch(clearEditingContext())}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
