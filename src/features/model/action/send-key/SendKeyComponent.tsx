import React, { useId } from 'react';
import { Form, FormCheck, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { ExpandCollapseComponent } from '../../../ui/ExpandCollapseComponent';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import {
  changeEditingSendKeyMode,
  changeSendKey,
  resetKeyToSend,
  resetOuterPause,
  toggleModifier,
  validateKeyToSend,
  validateOuterPause,
} from '../action-reducers';
import {
  keyToSendValidators,
  outerPauseValidators,
} from '../action-validation';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import {
  SendKeyAction,
  SendKeyPressAction,
  SendKeyHoldReleaseAction,
} from './send-key';
import { SendKeyMode } from './send-key-modes';
import { SendKeyModifiers } from './send-key-modifiers';
import { SendKeyField } from './send-key-payloads';
import { SendKeyHoldReleaseComponent } from './SendKeyHoldReleaseComponent';
import { SendKeyPressComponent } from './SendKeyPressComponent';

export const SendKeyComponent: React.FC<{
  sendKeyAction: SendKeyAction;
}> = (props) => {
  const dispatch = useAppDispatch();
  const controlModifierCheckboxId = useId();
  const shiftModifierCheckboxId = useId();
  const altModifierCheckboxId = useId();
  const windowsModifierCheckboxId = useId();

  const modeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingSendKeyMode({ sendKeyMode: event.target.value }));
  };
  const modifierToggledHandler = (modifier: SendKeyModifiers) => {
    dispatch(toggleModifier(modifier));
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
        <FormText className="text-muted">send-key mode</FormText>
      </FormGroupRowComponent>
      <ActionValueComponent<SendKeyField>
        actionValue={props.sendKeyAction.sendKey}
        labelText="Send Key"
        descriptionText="key to send"
        //
        changeFn={(eventTargetValue, op) =>
          changeSendKey({
            eventTargetValue: eventTargetValue,
            operation: op,
            field: SendKeyField.KEY_TO_SEND,
          })
        }
        resetFn={resetKeyToSend}
        validationFn={validateKeyToSend}
        //
        enterValueValidator={keyToSendValidators.value}
        variableValidator={keyToSendValidators.variable}
        roleKeyValidator={keyToSendValidators.roleKey}
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
        <ActionValueComponent<SendKeyField>
          actionValue={props.sendKeyAction.outerPause}
          labelText="Outer Pause"
          descriptionText="time to pause after keystroke, in centiseconds"
          changeFn={(eventTargetValue, op) =>
            changeSendKey({
              eventTargetValue: eventTargetValue,
              operation: op,
              field: SendKeyField.OUTER_PAUSE,
            })
          }
          resetFn={resetOuterPause}
          validationFn={validateOuterPause}
          variableValidator={outerPauseValidators.variable}
          roleKeyValidator={outerPauseValidators.roleKey}
        />
        {props.sendKeyAction.sendKeyMode === SendKeyMode.PRESS && (
          <SendKeyPressComponent
            sendKeyPressAction={props.sendKeyAction as SendKeyPressAction}
          />
        )}
        {props.sendKeyAction.sendKeyMode === SendKeyMode.HOLD_RELEASE && (
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
