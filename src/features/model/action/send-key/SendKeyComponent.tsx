import React, { useContext, useId } from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { Field } from '../../../../validation/validation-field';
import { ExpandCollapseComponent } from '../../../ui/ExpandCollapseComponent';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyAction } from './send-key';
import { SendKeyMode } from './send-key-modes';
import { SendKeyModifiers } from './send-key-modifiers';
import {
  keyToSendValidators,
  outerPauseValidators,
  toSendKeyHoldReleaseFM as KEY_HOLD_RELEASE,
  toSendKeyPressFM as KEY_PRESS,
} from './send-key-validators';
import { SendKeyHoldReleaseComponent } from './SendKeyHoldReleaseComponent';
import { SendKeyPressComponent } from './SendKeyPressComponent';

export const SendKeyComponent: React.FC<{
  sendKeyAction: SendKeyAction;
}> = (props) => {
  const controlModifierCheckboxId = useId();
  const shiftModifierCheckboxId = useId();
  const altModifierCheckboxId = useId();
  const windowsModifierCheckboxId = useId();
  const editingContext = useContext(ActionEditingContext);

  const modeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: event.target.value,
    });
  };
  const modifierToggledHandler = (modifier: SendKeyModifiers) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_MODIFIERS,
      payload: modifier,
    });
  };

  return (
    <>
      <FormGroupRowComponent
        labelText="Send Key Mode"
        descriptionText="press or hold/release"
      >
        <Form.Select
          aria-label="send-key mode selection"
          onChange={modeChangedHandler}
          value={props.sendKeyAction.sendKeyMode}
        >
          {SendKeyMode.values().map((skm) => (
            <option key={skm} value={skm}>
              {skm}
            </option>
          ))}
        </Form.Select>
      </FormGroupRowComponent>
      <ActionValueComponent
        actionValue={props.sendKeyAction.keyToSend}
        labelText="Key to Send"
        descriptionText="key to send"
        validators={keyToSendValidators}
        required={true}
      />
      <ExpandCollapseComponent
        buttonTextOpen="Less Options"
        buttonTextClosed="More Options"
      >
        <FormGroupRowComponent labelText="Modifier Keys">
          <FormCheck
            type="switch"
            id={controlModifierCheckboxId}
            label="Control/Command"
            checked={props.sendKeyAction.modifiers.control}
            onChange={(_e) => modifierToggledHandler(SendKeyModifiers.CONTROL)}
          />
          <FormCheck
            type="switch"
            id={shiftModifierCheckboxId}
            label="Shift"
            checked={props.sendKeyAction.modifiers.shift}
            onChange={(_e) => modifierToggledHandler(SendKeyModifiers.SHIFT)}
          />
          <FormCheck
            type="switch"
            id={altModifierCheckboxId}
            label="Alt"
            checked={props.sendKeyAction.modifiers.alt}
            onChange={(_e) => modifierToggledHandler(SendKeyModifiers.ALT)}
          />
          <FormCheck
            type="switch"
            id={windowsModifierCheckboxId}
            label="Windows"
            checked={props.sendKeyAction.modifiers.windows}
            onChange={(_e) => modifierToggledHandler(SendKeyModifiers.WINDOWS)}
          />
        </FormGroupRowComponent>
        <ActionValueComponent
          actionValue={props.sendKeyAction.outerPause}
          labelText="Outer Pause"
          descriptionText="time to pause after keystroke, in centiseconds"
          validators={outerPauseValidators}
        />

        {/* TODO: use the filter maps in components
        like below EVERYWHERE -- then the logic is actually shared */}

        {KEY_PRESS.filter(props.sendKeyAction) && (
          <SendKeyPressComponent
            sendKeyPressAction={KEY_PRESS.map(props.sendKeyAction)}
          />
        )}
        {KEY_HOLD_RELEASE.filter(props.sendKeyAction) && (
          <SendKeyHoldReleaseComponent
            sendKeyHoldReleaseAction={KEY_HOLD_RELEASE.map(props.sendKeyAction)}
          />
        )}
      </ExpandCollapseComponent>
    </>
  );
};
