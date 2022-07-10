import React from 'react';
import { changeSendKey, resetDirection } from '../action-reducers';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyHoldReleaseAction } from './send-key';
import { SendKeyField } from './send-key-payloads';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent<SendKeyField>
        labelText="Direction"
        descriptionText="up or down"
        actionValue={props.sendKeyHoldReleaseAction.direction}
        changeFn={(eventTargetValue, op) =>
          changeSendKey({
            eventTargetValue: eventTargetValue,
            operation: op,
            field: SendKeyField.DIRECTION,
          })
        }
        resetFn={() => resetDirection()}
      />
    </>
  );
};
