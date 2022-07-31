import React from 'react';
import { Field } from '../../../../validation/validation-field';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyHoldReleaseAction } from './send-key';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Direction"
        descriptionText="up or down"
        actionValue={props.sendKeyHoldReleaseAction.direction}
        fields={{
          radio: Field.AC_DIRECTION_RADIO,
          value: Field.AC_DIRECTION_VALUE,
          variable: Field.AC_DIRECTION_VAR,
          roleKey: Field.AC_DIRECTION_RK,
        }}
        required={true}
      />
    </>
  );
};
