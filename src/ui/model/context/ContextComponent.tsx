import React, { useContext, useReducer, useState } from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { ValidationContext } from '../../../validation/validation-context';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { PanelComponent } from '../../other-components/PanelComponent';
import { ElementType } from '../../../data/model/element-types';
import {
  ContextEditingContext,
  ContextReducerActionType,
} from './context-editing-context';
import { saveContext } from '../../../core/reducers/context-reducers';
import { ContextType } from '../../../data/model/context/context-types';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Context, createContext } from '../../../data/model/context/context';
import {
  contextReactReducer,
  deleteContext,
} from '../../../core/reducers/context-reducers';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { doNothing } from '../../../core/common/common-functions';
import { InjectionContext } from '../../../di/injector-context';
import { MapUtil } from '../../../core/common/map-util';
import { DomainMapper } from '../../../core/mappers/mapper';

const CTX_ROLE_KEY = Field.CTX_ROLE_KEY;

const init = (
  savedMap: Record<string, Context>,
  mapper: DomainMapper<Context, Context>
): ((c?: string) => Context) => {
  return (contextId?: string) => {
    if (contextId && savedMap[contextId]) {
      return mapper.mapToDomain({ ...MapUtil.getOrThrow(savedMap, contextId) });
    }
    return createContext();
  };
};

export const ContextComponent: React.FC<{
  contextId?: string;
  closeFn?: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const savedMap = useAppSelector((state) => state.context.saved);
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    contextReactReducer,
    props.contextId,
    init(savedMap, container.get(Tokens.DomainMapper_Context))
  );
  const [show, setShow] = useState(false);

  const closeFn = props.closeFn ?? doNothing;
  const handleDelete = () => {
    reduxDispatch(deleteContext(editing.id));
    closeFn();
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Context);

  return (
    <ValidationComponent<Context> validators={validators} editing={editing}>
      <ContextEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <ContextChildComponent context={editing} closeFn={closeFn} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.CTX_DELETE_MODAL_DELETE}
          cancelField={Field.CTX_DELETE_MODAL_CANCEL}
        />
      </ContextEditingContext.Provider>
    </ValidationComponent>
  );
};

const ContextChildComponent: React.FC<{
  context: Context;
  closeFn: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ContextEditingContext);
  const container = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.CONTEXT, props.context.id);
  const contextDefaultNamer = container.get(Tokens.DefaultNamer_Context);

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
    validationContext.touch(Field.CTX_ROLE_KEY);
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: ContextReducerActionType.CHANGE_TYPE,
      payload: event.target.value as ContextType.Type,
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
  const toggleEnabled = () => {
    editingContext.localDispatch({
      type: ContextReducerActionType.TOGGLE_ENABLED,
    });
  };
  const toggleLocked = () => {
    editingContext.localDispatch({
      type: ContextReducerActionType.TOGGLE_LOCKED,
    });
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForSave();
    if (isValid) {
      reduxDispatch(saveContext(props.context));
      props.closeFn();
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
      <ExportImportOptionsComponent
        element={props.context}
        toggleEnabledFn={toggleEnabled}
        toggleLockedFn={toggleLocked}
      />
      <FormGroupRowComponent labelText="Name" errorMessage={nameError}>
        <FormControl
          aria-label={Field[Field.CTX_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.CTX_NAME)}
          isInvalid={!!nameError}
          value={props.context.name}
          placeholder={contextDefaultNamer.getName(props.context)}
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
          aria-label={Field[Field.CTX_DELETE]}
        >
          Delete
        </Button>
      )}
      <Button
        onClick={props.closeFn}
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
