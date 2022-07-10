import React from 'react';
import {
  changeSendKey,
  resetInnerPause,
  resetRepeat,
} from '../action-reducers';
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
        resetFn={() => resetInnerPause()}
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
        resetFn={() => resetRepeat()}
      />
    </>
  );
};
