import React, { useContext, useId } from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { ValidationContext } from '../../../../validation/validation-context';
import { Field } from '../../../../validation/validation-field';
import { ExpandCollapseComponent } from '../../../other-components/ExpandCollapseComponent';
import { FormGroupRowComponent } from '../../../other-components/FormGroupRowComponent';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { ActionValueComponent } from '../ActionValueComponent';
import {
  isSendKeyHoldReleaseAction,
  isSendKeyPressAction,
  SendKeyAction,
} from '../../../../data/model/action/send-key/send-key';
import {
  skKeyToSendGroup,
  skOuterPauseGroup,
} from './send-key-action-value-field-groups';
import { SendKeyMode } from '../../../../data/model/action/send-key/send-key-modes';
import { SendKeyModifiers } from '../../../../data/model/action/send-key/send-key-modifiers';
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
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: event.target.value as SendKeyMode.Type,
    });
    validationContext.touch(Field.AC_SEND_KEY_MODE);
  };
  const modifierToggledHandler = (modifier: SendKeyModifiers) => {
    editingContext.localDispatch({
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
        fields={skKeyToSendGroup}
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
          descriptionText="time to pause after keystroke, in seconds"
          fields={skOuterPauseGroup}
        />
        {isSendKeyPressAction(props.sendKeyAction) && (
          <SendKeyPressComponent sendKeyPressAction={props.sendKeyAction} />
        )}
        {isSendKeyHoldReleaseAction(props.sendKeyAction) && (
          <SendKeyHoldReleaseComponent
            sendKeyHoldReleaseAction={props.sendKeyAction}
          />
        )}
      </ExpandCollapseComponent>
    </>
  );
};
