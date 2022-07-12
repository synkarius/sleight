import React from 'react';
import {
  changeSendKey,
  resetInnerPause,
  resetRepeat,
  validateInnerPause,
  validateRepeat,
} from '../action-reducers';
import { innerPauseValidators, repeatValidators } from '../action-validation';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyPressAction } from './send-key';
import { SendKeyField } from './send-key-payloads';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent<SendKeyField>
        actionValue={props.sendKeyPressAction.innerPause}
        labelText="Inner Pause"
        descriptionText="time to pause between repetitions of keystroke, in centiseconds"
        changeFn={(eventTargetValue, op) =>
          changeSendKey({
            eventTargetValue: eventTargetValue,
            operation: op,
            field: SendKeyField.INNER_PAUSE,
          })
        }
        resetFn={resetInnerPause}
        validationFn={validateInnerPause}
        variableValidator={innerPauseValidators.variable}
        roleKeyValidator={innerPauseValidators.roleKey}
      />
      <ActionValueComponent<SendKeyField>
        actionValue={props.sendKeyPressAction.repeat}
        labelText="Repeat"
        descriptionText="times to repeat keystroke"
        changeFn={(eventTargetValue, op) =>
          changeSendKey({
            eventTargetValue: eventTargetValue,
            operation: op,
            field: SendKeyField.REPEAT,
          })
        }
        resetFn={resetRepeat}
        validationFn={validateRepeat}
        variableValidator={repeatValidators.variable}
        roleKeyValidator={repeatValidators.roleKey}
      />
    </>
  );
};
