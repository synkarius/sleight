import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { setEditorFocus } from '../../other-components/menu/editor/editor-focus-reducers';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Context, createContext } from './context';
import { ContextEditingContext } from './context-editing-context';
import { contextReactReducer, deleteContext } from './context-reducers';
import { ContextComponent } from './ContextComponent';
import { Field } from '../../../validation/validation-field';

const init = (savedMap: Record<string, Context>): ((c?: string) => Context) => {
  return (contextId?: string) => {
    if (contextId && savedMap[contextId]) {
      return { ...savedMap[contextId] };
    }
    return createContext();
  };
};

export const ContextParentComponent: React.FC<{ contextId?: string }> = (
  props
) => {
  const reduxDispatch = useAppDispatch();
  const savedMap = useAppSelector((state) => state.context.saved);
  const [editing, localDispatch] = useReducer(
    contextReactReducer,
    props.contextId,
    init(savedMap)
  );
  const injectionContext = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteContext(editing.id));
    reduxDispatch(setEditorFocus());
  };
  const deleteModalConfig = { show, setShow };

  return (
    <ValidationComponent<Context>
      validators={[...injectionContext.validators.context]}
      editing={editing}
    >
      <ContextEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <ContextComponent context={editing} />
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
