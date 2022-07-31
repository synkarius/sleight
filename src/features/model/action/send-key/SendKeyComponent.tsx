import React, { useContext, useId } from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { ValidationContext } from '../../../../validation/validation-context';
import { Field } from '../../../../validation/validation-field';
import { ExpandCollapseComponent } from '../../../ui/ExpandCollapseComponent';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import {
  isSendKeyHoldReleaseAction,
  isSendKeyPressAction,
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key';
import { SendKeyMode } from './send-key-modes';
import { SendKeyModifiers } from './send-key-modifiers';
import { SendKeyHoldReleaseComponent } from './SendKeyHoldReleaseComponent';
import { SendKeyPressComponent } from './SendKeyPressComponent';

export const SendKeyComponent: React.FC<{
  sendKeyAction: SendKeyAction;
}> = (props) => {
  const controlModifierCheckboxId = useId();
  const shiftModifierCheckboxId = useId();
  const altModifierCheckboxId = useId();
  const windowsModifierCheckboxId = useId();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);

  const modeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: event.target.value as SendKeyMode.Type,
    });
    validationContext.touch(Field.AC_SEND_KEY_MODE);
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
          aria-label={Field[Field.AC_SEND_KEY_MODE]}
          role="list"
          onChange={modeChangedHandler}
          value={props.sendKeyAction.sendKeyMode}
        >
          {SendKeyMode.values().map((skm) => (
            <option key={skm} value={skm} role="listitem">
              {skm}
            </option>
          ))}
        </Form.Select>
      </FormGroupRowComponent>
      <ActionValueComponent
        actionValue={props.sendKeyAction.keyToSend}
        labelText="Key to Send"
        descriptionText="key to send"
        fields={{
          radio: Field.AC_KEY_TO_SEND_RADIO,
          value: Field.AC_KEY_TO_SEND_VALUE,
          variable: Field.AC_KEY_TO_SEND_VAR,
          roleKey: Field.AC_KEY_TO_SEND_RK,
        }}
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
          fields={{
            radio: Field.AC_OUTER_PAUSE_RADIO,
            value: Field.AC_OUTER_PAUSE_VALUE,
            variable: Field.AC_OUTER_PAUSE_VAR,
            roleKey: Field.AC_OUTER_PAUSE_RK,
          }}
        />

        {/* TODO: use the type guards in components
        like below EVERYWHERE -- then the logic is actually shared */}

        {isSendKeyPressAction(props.sendKeyAction) && (
          <SendKeyPressComponent
            sendKeyPressAction={props.sendKeyAction as SendKeyPressAction}
          />
        )}
        {isSendKeyHoldReleaseAction(props.sendKeyAction) && (
          <SendKeyHoldReleaseComponent
            sendKeyHoldReleaseAction={
              props.sendKeyAction as SendKeyHoldReleaseAction
            }
          />
        )}
      </ExpandCollapseComponent>
    </>
  );
};
