import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModal } from '../../other-components/DeleteModal';
import { Action } from './action';
import { ActionEditingContext } from './action-editing-context';
import { actionReactReducer, deleteAction } from './action-reducers';
import { ActionComponent } from './ActionComponent';
import { createSendKeyPressAction } from './send-key/send-key';
import { setEditorFocus } from '../../other-components/menu/editor/editor-focus-reducers';
import { Field } from '../../../validation/validation-field';

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
  const savedMap = useAppSelector((state) => state.action.saved);
  const [editing, localDispatch] = useReducer(
    actionReactReducer,
    props.actionId,
    init(savedMap)
  );
  const injectionContext = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteAction(editing.id));
    reduxDispatch(setEditorFocus());
  };
  const deleteModalConfig = { show, setShow };

  return (
    <ValidationComponent<Action>
      validators={[...injectionContext.validators.action]}
      editing={editing}
    >
      <ActionEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <ActionComponent action={editing} />
        <DeleteModal
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
