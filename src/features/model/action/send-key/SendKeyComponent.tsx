import React, { useId } from 'react';
import { Form, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import {
  changeEditingSendKeyMode,
  changeOuterPauseValue,
  changeOuterPauseVariableId,
  toggleOuterPauseIded,
} from '../action-reducers';
import { ChoiceValueComponent } from '../action-value/ChoiceValueComponent';
import { RangeValueComponent } from '../action-value/RangeValueComponent';
import {
  SendKeyAction,
  SendKeyPressAction,
  SendKeyHoldReleaseAction,
} from './send-key';
import { SendKeyMode } from './send-key-modes';
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

  return (
    <>
      <FormGroupRowComponent labelText="Send Key Mode">
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
      <FormGroupRowComponent labelText="Modifier Keys">
        <Form.Check
          type="switch"
          id={controlModifierCheckboxId}
          label="Control/Command"
          checked={props.sendKeyAction.modifiers.control}
        />
        <Form.Check
          type="switch"
          id={shiftModifierCheckboxId}
          label="Shift"
          checked={props.sendKeyAction.modifiers.shift}
        />
        <Form.Check
          type="switch"
          id={altModifierCheckboxId}
          label="Alt"
          checked={props.sendKeyAction.modifiers.alt}
        />
        <Form.Check
          type="switch"
          id={windowsModifierCheckboxId}
          label="Windows"
          checked={props.sendKeyAction.modifiers.windows}
        />
      </FormGroupRowComponent>
      <ChoiceValueComponent
        labelText="Key to Send"
        choiceValue={props.sendKeyAction.sendKey}
      />
      <RangeValueComponent
        labelText="Outer Pause"
        rangeValue={props.sendKeyAction.outerPause}
        idedChangedFn={(_e) => dispatch(toggleOuterPauseIded())}
        valueChangedFn={(e) => dispatch(changeOuterPauseValue(e.target.value))}
        variableIdChangedFn={(id) => changeOuterPauseVariableId(id)}
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
    </>
  );
};
