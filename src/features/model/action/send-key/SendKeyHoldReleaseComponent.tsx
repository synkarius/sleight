import React from 'react';
import { Field } from '../../../../validation/validation-field';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyHoldReleaseAction } from './send-key';
import { directionValidators } from './send-key-validators';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Direction"
        descriptionText="up or down"
        actionValue={props.sendKeyHoldReleaseAction.direction}
        field={Field.AC_DIRECTION_RADIO}
        enterValueValidator={directionValidators.value}
        variableValidator={directionValidators.variable}
        roleKeyValidator={directionValidators.roleKey}
        required={true}
      />
    </>
  );
};
