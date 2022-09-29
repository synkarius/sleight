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
import { useNavigate } from 'react-router-dom';
import { EMPTY_PATH } from '../../../core/common/consts';

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
  const navigate = useNavigate();
  const savedMap = useAppSelector((state) => state.context.saved);
  const [editing, localDispatch] = useReducer(
    contextReactReducer,
    props.contextId,
    init(savedMap)
  );
  const container = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteContext(editing.id));
    navigate(EMPTY_PATH);
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Context);

  return (
    <ValidationComponent<Context> validators={validators} editing={editing}>
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
