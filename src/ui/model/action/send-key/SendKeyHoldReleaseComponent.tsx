import React from 'react';
import { ActionValueComponent } from '../ActionValueComponent';
import { SendKeyHoldReleaseAction } from '../../../../data/model/action/send-key/send-key';
import { skDirectionGroup } from './send-key-action-value-field-groups';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Direction"
        descriptionText="up or down"
        actionValue={props.sendKeyHoldReleaseAction.direction}
        fields={skDirectionGroup}
        required={true}
      />
    </>
  );
};
