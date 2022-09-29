import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Action } from '../../../data/model/action/action';
import { ActionEditingContext } from './action-editing-context';
import {
  actionReactReducer,
  deleteAction,
} from '../../../core/reducers/action-reducers';
import { ActionComponent } from './ActionComponent';
import { createSendKeyPressAction } from '../../../data/model/action/send-key/send-key';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { useNavigate } from 'react-router-dom';
import { EMPTY_PATH } from '../../../core/common/consts';

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
  const reduxDispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedMap = useAppSelector((state) => state.action.saved);
  const [editing, localDispatch] = useReducer(
    actionReactReducer,
    props.actionId,
    init(savedMap)
  );
  const container = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteAction(editing.id));
    // reduxDispatch(setEditorFocus());
    navigate(EMPTY_PATH);
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Action);

  return (
    <ValidationComponent<Action> validators={validators} editing={editing}>
      <ActionEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <ActionComponent action={editing} />
        <DeleteModalComponent
          /** editing.name is fine here because the modal won't show unless
           * the element is saved, and the element can't be saved without a name
           */
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.AC_DELETE_MODAL_DELETE}
          cancelField={Field.AC_DELETE_MODAL_CANCEL}
        />
      </ActionEditingContext.Provider>
    </ValidationComponent>
  );
};
