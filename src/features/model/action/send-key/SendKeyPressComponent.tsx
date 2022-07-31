import React from 'react';
import { Field } from '../../../../validation/validation-field';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyPressAction } from './send-key';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.innerPause}
        labelText="Inner Pause"
        descriptionText="time to pause between repetitions of keystroke, in centiseconds"
        fields={{
          radio: Field.AC_INNER_PAUSE_RADIO,
          value: Field.AC_INNER_PAUSE_VALUE,
          variable: Field.AC_INNER_PAUSE_VAR,
          roleKey: Field.AC_INNER_PAUSE_RK,
        }}
      />
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.repeat}
        labelText="Repeat"
        descriptionText="times to repeat keystroke"
        fields={{
          radio: Field.AC_REPEAT_RADIO,
          value: Field.AC_REPEAT_VALUE,
          variable: Field.AC_REPEAT_VAR,
          roleKey: Field.AC_REPEAT_RK,
        }}
      />
    </>
  );
};
