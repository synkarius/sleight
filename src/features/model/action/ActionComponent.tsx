import React, { useContext } from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { ActionType } from './action-types';
import { saveAction } from './action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { isSendKeyAction } from './send-key/send-key';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { ValidationContext } from '../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from './action-editing-context';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { Field } from '../../../validation/validation-field';
import { Action } from './action';
import { isMouseAction } from './mouse/mouse';
import { MouseComponent } from './mouse/MouseComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { isPauseAction } from './pause/pause';
import { PauseComponent } from './pause/PauseComponent';
import { InjectionContext } from '../../../di/injector-context';
import { useSaved } from '../../../data/use-saved-hook';
import { ElementType } from '../../../common/element-types';

const AC_NAME = Field.AC_NAME;
const AC_ROLE_KEY = Field.AC_ROLE_KEY;

export const ActionComponent: React.FC<{ action: Action }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);
  const injectionContext = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.ACTION, props.action.id);
  const actionDefaultNamer = injectionContext.default.namers.action;

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(AC_NAME);
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ACTION_TYPE,
      payload: event.target.value as ActionType.Type,
    });
    validationContext.touch(Field.AC_TYPE);
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForSave();
    if (formIsValid) {
      reduxDispatch(saveAction(props.action));
      reduxDispatch(setEditorFocus());
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <PanelComponent header="Create/Edit Action">
      <FormGroupRowComponent
        labelText="Name"
        descriptionText="name of action"
        errorMessage={errorResults([AC_NAME])}
      >
        <FormControl
          aria-label={Field[AC_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(AC_NAME)}
          isInvalid={!!errorResults([AC_NAME])}
          value={props.action.name}
          placeholder={actionDefaultNamer.getDefaultName(props.action)}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of action"
        errorMessage={errorResults([AC_ROLE_KEY])}
      >
        <FormControl
          aria-label={Field[AC_ROLE_KEY]}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(AC_ROLE_KEY)}
          isInvalid={!!errorResults([AC_ROLE_KEY])}
          value={props.action.roleKey}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type" descriptionText="type of action">
        <FormSelect
          aria-label={Field[Field.AC_TYPE]}
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
      {isSendKeyAction(props.action) && (
        <SendKeyComponent sendKeyAction={props.action} />
      )}
      {isMouseAction(props.action) && (
        <MouseComponent mouseAction={props.action} />
      )}
      {isPauseAction(props.action) && (
        <PauseComponent pauseAction={props.action} />
      )}

      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
        >
          Delete
        </Button>
      )}
      <Button
        onClick={(_e) => reduxDispatch(setEditorFocus())}
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
