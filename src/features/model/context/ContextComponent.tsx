import React, { useContext } from 'react';
import {
  Button,
  Form,
  FormControl,
  FormSelect,
  FormText,
} from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { getRelevantErrorMessage } from '../../../validation/field-validator';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { setFocus } from '../../menu/focus/focus-reducers';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Context } from './context';
import {
  ContextEditingContext,
  ContextReducerActionType,
} from './context-editing-context';
import { saveEditingContext } from './context-reducers';
import { ContextType } from './context-types';

export const ContextComponent: React.FC<{ context: Context }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const contextEditingContext = useContext(ContextEditingContext);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    contextEditingContext.localDispatchFn({
      type: ContextReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    contextEditingContext.localDispatchFn({
      type: ContextReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    contextEditingContext.localDispatchFn({
      type: ContextReducerActionType.CHANGE_TYPE,
      payload: event.target.value,
    });
  };
  const matcherChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    contextEditingContext.localDispatchFn({
      type: ContextReducerActionType.CHANGE_MATCHER,
      payload: event.target.value,
    });
    validationContext.touch(Field.CTX_MATCHER);
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForm();
    if (isValid) {
      reduxDispatch(saveEditingContext(props.context));
    }
  };

  const matcherField = Field.CTX_MATCHER;
  const matcherHelpText =
    props.context.type === ContextType.Enum.EXECUTABLE_NAME
      ? 'executable to match'
      : 'window title to match';
  const errorResults = validationContext.getErrorResults();
  const errorMessage = getRelevantErrorMessage(errorResults, [matcherField]);

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
          onChange={roleKeyChangedHandler}
        />
        <FormText className="text-muted">role of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type">
        <FormSelect
          aria-label={Field[Field.CTX_TYPE]}
          role="list"
          onChange={typeChangedHandler}
          value={props.context.type}
        >
          {ContextType.values().map((ct) => (
            <option key={ct} value={ct} role="listitem">
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
          onBlur={(_e) => validationContext.touch(matcherField)}
          value={props.context.matcher}
          isInvalid={errorResults
            .map((result) => result.field)
            .includes(matcherField)}
          role="textbox"
          aria-label={Field[matcherField]}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </FormGroupRowComponent>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={errorResults.length > 0}
      >
        Save
      </Button>
      <Button
        onClick={(_e) => reduxDispatch(setFocus())}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
