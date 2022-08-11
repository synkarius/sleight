import React, { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { Context, createContext } from './context';
import { ContextEditingContext } from './context-editing-context';
import { contextReactReducer } from './context-reducers';
import { contextMatcherValidator } from './context-validation';
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
  const savedMap = useAppSelector((state) => state.context.saved);
  const [editing, localDispatch] = useReducer(
    contextReactReducer,
    props.contextId,
    init(savedMap)
  );
  return (
    <ValidationComponent<Context>
      validators={[contextMatcherValidator]}
      editing={editing}
    >
      <ContextEditingContext.Provider
        value={{ localDispatchFn: localDispatch }}
      >
        <ContextComponent context={editing} />
      </ContextEditingContext.Provider>
    </ValidationComponent>
  );
};
