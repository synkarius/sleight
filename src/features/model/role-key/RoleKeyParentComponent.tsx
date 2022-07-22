import React, { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createRoleKey, RoleKey } from './role-key';
import { RoleKeyEditingContext } from './role-key-editing-context';
import { roleKeyReactReducer } from './role-key-reducers';
import { roleKeyTextValidator } from './role-key-validation';
import { RoleKeyComponent } from './RoleKeyComponent';

const init = (
  savedMap: ReduxFriendlyStringMap<RoleKey>
): ((returnRoleKeyId: string | undefined) => RoleKey) => {
  return (roleKeyId: string | undefined) => {
    if (roleKeyId && savedMap[roleKeyId]) {
      return { ...savedMap[roleKeyId] };
    }
    return createRoleKey();
  };
};

export const RoleKeyParentComponent: React.FC<{ roleKeyId?: string }> = (
  props
) => {
  const savedMap = useAppSelector((state) => state.roleKey.saved);
  const [editing, localDispatch] = useReducer(
    roleKeyReactReducer,
    props.roleKeyId,
    init(savedMap)
  );

  return (
    <ValidationComponent<RoleKey>
      validators={[roleKeyTextValidator]}
      editing={editing}
    >
      <RoleKeyEditingContext.Provider
        value={{ localDispatchFn: localDispatch }}
      >
        <RoleKeyComponent roleKey={editing} />
      </RoleKeyEditingContext.Provider>
    </ValidationComponent>
  );
};
