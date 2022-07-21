import React from 'react';
import { Field } from '../../../../validation/validation-field';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyPressAction } from './send-key';
import { innerPauseValidators, repeatValidators } from './send-key-validators';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.innerPause}
        labelText="Inner Pause"
        descriptionText="time to pause between repetitions of keystroke, in centiseconds"
        field={Field.AC_INNER_PAUSE_RADIO}
        variableValidator={innerPauseValidators.variable}
        roleKeyValidator={innerPauseValidators.roleKey}
      />
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.repeat}
        labelText="Repeat"
        descriptionText="times to repeat keystroke"
        field={Field.AC_REPEAT_RADIO}
        variableValidator={repeatValidators.variable}
        roleKeyValidator={repeatValidators.roleKey}
      />
    </>
  );
};
