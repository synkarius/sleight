import React, { useContext, useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { Context, createContext } from './context';
import { ContextEditingContext } from './context-editing-context';
import { contextReactReducer } from './context-reducers';
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
  const injectionContext = useContext(InjectionContext);
  return (
    <ValidationComponent<Context>
      validators={[...injectionContext.validators.context]}
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
