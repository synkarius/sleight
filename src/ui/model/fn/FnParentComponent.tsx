import React, { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EMPTY_PATH } from '../../../core/common/consts';
import { deleteFn, fnReactReducer } from '../../../core/reducers/fn-reducers';
import { createPythonFn, Fn } from '../../../data/model/fn/fn';
import { Tokens } from '../../../di/config/brandi-tokens';
import { InjectionContext } from '../../../di/injector-context';
import { Field } from '../../../validation/validation-field';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { FnEditingContext } from './fn-editing-context';
import { FnComponent } from './FnComponent';

const init = (savedMap: Record<string, Fn>): ((f?: string) => Fn) => {
  return (fnId?: string) => {
    if (fnId && savedMap[fnId]) {
      return { ...savedMap[fnId] };
    }
    return createPythonFn();
  };
};

export const FnParentComponent: React.FC<{ fnId?: string }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedMap = useAppSelector((state) => state.fn.saved);
  const [editing, localDispatch] = useReducer(
    fnReactReducer,
    props.fnId,
    init(savedMap)
  );
  const container = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteFn(editing.id));
    navigate(EMPTY_PATH);
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Fn);
  return (
    <ValidationComponent<Fn> validators={validators} editing={editing}>
      <FnEditingContext.Provider value={{ localDispatch, deleteModalConfig }}>
        <FnComponent fn={editing} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.FN_DELETE_MODAL_DELETE}
          cancelField={Field.FN_DELETE_MODAL_CANCEL}
        />
      </FnEditingContext.Provider>
    </ValidationComponent>
  );
};
