import React from 'react';
import {
  changeDirectionActionValueType,
  changeDirectionRoleKeyId,
  changeDirectionValue,
  changeDirectionVariableId,
} from '../action-reducers';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyHoldReleaseAction } from './send-key';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Direction"
        actionValue={props.sendKeyHoldReleaseAction.direction}
        actionValueTypeChangedFn={(type) =>
          changeDirectionActionValueType(type)
        }
        valueChangedFn={(value) => changeDirectionValue(value)}
        variableIdChangedFn={(id) => changeDirectionVariableId(id)}
        roleKeyIdChangedFn={(id) => changeDirectionRoleKeyId(id)}
      />
    </>
  );
};
