import React, { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { Action } from './action';
import { ActionEditingContext } from './action-editing-context';
import { actionReactReducer } from './action-reducers';
import { ActionComponent } from './ActionComponent';
import { createSendKeyPressAction } from './send-key/send-key';
import {
  directionValidators,
  innerPauseValidators,
  keyToSendValidators,
  outerPauseValidators,
  repeatValidators,
} from './send-key/send-key-validators';

const init = (
  savedMap: ReduxFriendlyStringMap<Action>
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

  return (
    <ValidationComponent<Action>
      validators={[
        keyToSendValidators.value,
        keyToSendValidators.variable,
        keyToSendValidators.roleKey,
        outerPauseValidators.variable,
        outerPauseValidators.roleKey,
        innerPauseValidators.variable,
        innerPauseValidators.roleKey,
        repeatValidators.variable,
        repeatValidators.roleKey,
        directionValidators.value,
        directionValidators.variable,
        directionValidators.roleKey,
      ]}
      editing={editing}
    >
      <ActionEditingContext.Provider value={{ localDispatchFn: localDispatch }}>
        <ActionComponent action={editing} />
      </ActionEditingContext.Provider>
    </ValidationComponent>
  );
};
