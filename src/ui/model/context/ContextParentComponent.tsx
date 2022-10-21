import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Context, createContext } from '../../../data/model/context/context';
import { ContextEditingContext } from './context-editing-context';
import {
  contextReactReducer,
  deleteContext,
} from '../../../core/reducers/context-reducers';
import { ContextComponent } from './ContextComponent';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { doNothing } from '../../../core/common/common-functions';

const init = (savedMap: Record<string, Context>): ((c?: string) => Context) => {
  return (contextId?: string) => {
    if (contextId && savedMap[contextId]) {
      return { ...savedMap[contextId] };
    }
    return createContext();
  };
};

export const ContextParentComponent: React.FC<{
  contextId?: string;
  closeFn?: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const savedMap = useAppSelector((state) => state.context.saved);
  const [editing, localDispatch] = useReducer(
    contextReactReducer,
    props.contextId,
    init(savedMap)
  );
  const container = useContext(InjectionContext);
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
        <ContextComponent context={editing} closeFn={closeFn} />
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
