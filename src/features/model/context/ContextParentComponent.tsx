import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { DeleteModal } from '../../ui/DeleteModal';
import { Context, createContext } from './context';
import { ContextEditingContext } from './context-editing-context';
import { contextReactReducer, deleteContext } from './context-reducers';
import { ContextComponent } from './ContextComponent';

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
        <DeleteModal
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
        />
      </ContextEditingContext.Provider>
    </ValidationComponent>
  );
};
