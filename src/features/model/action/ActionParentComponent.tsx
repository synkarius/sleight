import React, { useContext, useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { Action } from './action';
import { ActionEditingContext } from './action-editing-context';
import { actionReactReducer } from './action-reducers';
import { ActionComponent } from './ActionComponent';
import { createSendKeyPressAction } from './send-key/send-key';

const init = (
  savedMap: Record<string, Action>
): ((returnActionId?: string) => Action) => {
  return (actionId?: string) => {
    if (actionId && savedMap[actionId]) {
      return { ...savedMap[actionId] };
    }
    return createSendKeyPressAction();
  };
};

export const ActionParentComponent: React.FC<{ actionId?: string }> = (
  props
) => {
  const savedMap = useAppSelector((state) => state.action.saved);
  const [editing, localDispatch] = useReducer(
    actionReactReducer,
    props.actionId,
    init(savedMap)
  );
  const injectionContext = useContext(InjectionContext);

  return (
    <ValidationComponent<Action>
      validators={[...injectionContext.validators.action]}
      editing={editing}
    >
      <ActionEditingContext.Provider value={{ localDispatchFn: localDispatch }}>
        <ActionComponent action={editing} />
      </ActionEditingContext.Provider>
    </ValidationComponent>
  );
};
