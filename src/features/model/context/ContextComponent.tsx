import React, { useContext } from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { useSaved } from '../../../data/use-saved';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { ElementType } from '../common/element-types';
import { Context } from './context';
import {
  ContextEditingContext,
  ContextReducerActionType,
} from './context-editing-context';
import { saveContext } from './context-reducers';
import { ContextType } from './context-types';

const CTX_ROLE_KEY = Field.CTX_ROLE_KEY;

export const ContextComponent: React.FC<{ context: Context }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ContextEditingContext);
  const injectionContext = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.CONTEXT, props.context.id);
  const contextDefaultNamer = injectionContext.default.namers.context;

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: ContextReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(Field.CTX_NAME);
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: ContextReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: ContextReducerActionType.CHANGE_TYPE,
      payload: event.target.value,
    });
  };
  const matcherChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: ContextReducerActionType.CHANGE_MATCHER,
      payload: event.target.value,
    });
    validationContext.touch(Field.CTX_MATCHER);
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForSave();
    if (isValid) {
      reduxDispatch(saveContext(props.context));
      reduxDispatch(setEditorFocus());
    }
  };

  const matcherField = Field.CTX_MATCHER;
  const matcherHelpText =
    props.context.type === ContextType.Enum.EXECUTABLE_NAME
      ? 'executable to match'
      : 'window title to match';
  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const nameError = errorResults([Field.CTX_NAME]);

  return (
    <PanelComponent header="Create/Edit Context">
      <FormGroupRowComponent labelText="Name" errorMessage={nameError}>
        <FormControl
          aria-label={Field[Field.CTX_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.CTX_NAME)}
          isInvalid={!!nameError}
          value={props.context.name}
          placeholder={contextDefaultNamer.getDefaultName(props.context)}
        />
        <FormText className="text-muted">name of context</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of context"
        errorMessage={errorResults([CTX_ROLE_KEY])}
      >
        <FormControl
          aria-label={Field[CTX_ROLE_KEY]}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(CTX_ROLE_KEY)}
          isInvalid={!!errorResults([CTX_ROLE_KEY])}
          value={props.context.roleKey}
        />
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
        errorMessage={errorResults([matcherField])}
      >
        <FormControl
          type="text"
          onChange={matcherChangedHandler}
          onBlur={(_e) => validationContext.touch(matcherField)}
          value={props.context.matcher}
          isInvalid={!!errorResults([matcherField])}
          role="textbox"
          aria-label={Field[matcherField]}
        />
      </FormGroupRowComponent>
      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
        >
          Delete
        </Button>
      )}
      <Button
        onClick={(_e) => reduxDispatch(setEditorFocus())}
        className="me-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={fullErrorResults.length > 0}
      >
        Save
      </Button>
    </PanelComponent>
  );
};
