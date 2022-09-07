import React from 'react';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { Direction } from '../../../../data/model/action/direction';
import { SendKeyHoldReleaseAction } from '../../../../data/model/action/send-key/send-key';
import { directionGroup } from './send-key-action-value-field-groups';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Direction"
        descriptionText="up or down"
        actionValue={{
          ...props.sendKeyHoldReleaseAction.direction,
          enumValues: Direction.values(),
        }}
        fields={directionGroup}
        required={true}
      />
    </>
  );
};
