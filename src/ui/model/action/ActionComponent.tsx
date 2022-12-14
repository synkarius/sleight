import React, { useContext, useReducer, useState } from 'react';
import { Button, FormControl, FormSelect } from 'react-bootstrap';
import { PanelComponent } from '../../other-components/PanelComponent';
import { ActionType } from '../../../data/model/action/action-types';
import { saveAction } from '../../../core/reducers/action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { isSendKeyAction } from '../../../data/model/action/send-key/send-key';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { ValidationContext } from '../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from './action-editing-context';
import { isMouseAction } from '../../../data/model/action/mouse/mouse';
import { MouseComponent } from './mouse/MouseComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { isPauseAction } from '../../../data/model/action/pause/pause';
import { PauseComponent } from './pause/PauseComponent';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { ElementType } from '../../../data/model/element-types';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';
import { isSendTextAction } from '../../../data/model/action/send-text/send-text';
import { SendTextComponent } from './send-text/SendTextComponent';
import { isWaitForWindowAction } from '../../../data/model/action/wait-for-window/wait-for-window';
import { WaitForWindowComponent } from './wait-for-window/WaitForWindowComponent';
import { isMimicAction } from '../../../data/model/action/mimic/mimic';
import { MimicComponent } from './mimic/MimicComponent';
import { isBringAppAction } from '../../../data/model/action/bring-app/bring-app';
import { BringAppComponent } from './bring-app/BringAppComponent';
import { isCallFunctionAction } from '../../../data/model/action/call-function/call-function';
import { CallFunctionComponent } from './call-function/CallFunctionComponent';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Action } from '../../../data/model/action/action';
import {
  actionReactReducer,
  deleteAction,
} from '../../../core/reducers/action-reducers';
import { createSendKeyPressAction } from '../../../data/model/action/send-key/send-key';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { doNothing } from '../../../core/common/common-functions';
import { MapUtil } from '../../../core/common/map-util';
import { DomainMapper } from '../../../core/mappers/mapper';
import { fieldName } from '../../../validation/field-name';

const AC_NAME = Field.AC_NAME;
const AC_ROLE_KEY = Field.AC_ROLE_KEY;

const init = (
  savedMap: Record<string, Action>,
  mapper: DomainMapper<Action, Action>
): ((returnActionId?: string) => Action) => {
  return (actionId?: string) => {
    if (actionId && savedMap[actionId]) {
      return mapper.mapToDomain({ ...MapUtil.getOrThrow(savedMap, actionId) });
    }
    return createSendKeyPressAction();
  };
};

export const ActionComponent: React.FC<{
  actionId?: string;
  closeFn?: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const savedMap = useAppSelector((state) => state.action.saved);
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    actionReactReducer,
    props.actionId,
    init(savedMap, container.get(Tokens.DomainMapper_Action))
  );
  const [show, setShow] = useState(false);

  const closeFn = props.closeFn ?? doNothing;
  const handleDelete = () => {
    reduxDispatch(deleteAction(editing.id));
    closeFn();
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Action);

  return (
    <ValidationComponent<Action> validators={validators} editing={editing}>
      <ActionEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <ActionChildComponent action={editing} closeFn={closeFn} />
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

const ActionChildComponent: React.FC<{
  action: Action;
  closeFn: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);
  const container = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.ACTION, props.action.id);
  const actionDefaultNamer = container.get(Tokens.DefaultNamer_Action);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(AC_NAME);
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
    validationContext.touch(AC_ROLE_KEY);
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ACTION_TYPE,
      payload: event.target.value as ActionType.Type,
    });
    validationContext.touch(Field.AC_TYPE);
  };
  const toggleEnabled = () => {
    editingContext.localDispatch({
      type: ActionReducerActionType.TOGGLE_ENABLED,
    });
  };
  const toggleLocked = () => {
    editingContext.localDispatch({
      type: ActionReducerActionType.TOGGLE_LOCKED,
    });
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForSave();
    if (formIsValid) {
      reduxDispatch(saveAction(props.action));
      props.closeFn();
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <PanelComponent header="Create/Edit Action">
      <ExportImportOptionsComponent
        element={props.action}
        toggleEnabledFn={toggleEnabled}
        toggleLockedFn={toggleLocked}
      />
      <FormGroupRowComponent
        labelText="Name"
        descriptionText="name of action"
        errorMessage={errorResults(AC_NAME)}
      >
        <FormControl
          aria-label={fieldName(AC_NAME)}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(AC_NAME)}
          isInvalid={!!errorResults(AC_NAME)}
          value={props.action.name}
          placeholder={actionDefaultNamer.getName(props.action)}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of action"
        errorMessage={errorResults(AC_ROLE_KEY)}
      >
        <FormControl
          aria-label={fieldName(AC_ROLE_KEY)}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(AC_ROLE_KEY)}
          isInvalid={!!errorResults(AC_ROLE_KEY)}
          value={props.action.roleKey}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type" descriptionText="type of action">
        <FormSelect
          aria-label={fieldName(Field.AC_TYPE)}
          role="list"
          onChange={typeChangedHandler}
          value={props.action.type}
        >
          {ActionType.values().map((ait) => (
            <option key={ait} value={ait} role="listitem">
              {ait}
            </option>
          ))}
        </FormSelect>
      </FormGroupRowComponent>

      {isBringAppAction(props.action) && (
        <BringAppComponent bringAppAction={props.action} />
      )}
      {isCallFunctionAction(props.action) && (
        <CallFunctionComponent callFunctionAction={props.action} />
      )}
      {isMimicAction(props.action) && (
        <MimicComponent mimicAction={props.action} />
      )}
      {isMouseAction(props.action) && (
        <MouseComponent mouseAction={props.action} />
      )}
      {isPauseAction(props.action) && (
        <PauseComponent pauseAction={props.action} />
      )}
      {isSendKeyAction(props.action) && (
        <SendKeyComponent sendKeyAction={props.action} />
      )}
      {isSendTextAction(props.action) && (
        <SendTextComponent sendTextAction={props.action} />
      )}
      {isWaitForWindowAction(props.action) && (
        <WaitForWindowComponent wfwAction={props.action} />
      )}

      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
          aria-label={fieldName(Field.AC_DELETE)}
        >
          Delete
        </Button>
      )}
      <Button
        onClick={props.closeFn}
        className="me-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={fullErrorResults.length > 0}
      >
        Save
      </Button>
    </PanelComponent>
  );
};
