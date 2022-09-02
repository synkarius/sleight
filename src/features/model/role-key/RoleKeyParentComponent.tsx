import React, { useContext, useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createRoleKey, RoleKey } from './role-key';
import { RoleKeyEditingContext } from './role-key-editing-context';
import { roleKeyReactReducer } from './role-key-reducers';
import { RoleKeyComponent } from './RoleKeyComponent';

const init = (
  savedMap: Record<string, RoleKey>
): ((returnRoleKeyId?: string) => RoleKey) => {
  return (roleKeyId?: string) => {
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
  const injectionContext = useContext(InjectionContext);

  return (
    <ValidationComponent<RoleKey>
      validators={[...injectionContext.validators.roleKey]}
      editing={editing}
    >
      <RoleKeyEditingContext.Provider
        value={{
          localDispatch,
          deleteModalConfig: {
            show: false,
            setShow: (_) => {},
          },
        }}
      >
        <RoleKeyComponent roleKey={editing} />
      </RoleKeyEditingContext.Provider>
    </ValidationComponent>
  );
};
