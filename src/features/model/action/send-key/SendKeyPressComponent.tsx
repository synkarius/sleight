import React from 'react';
import {
  changeInnerPauseActionValueType,
  changeInnerPauseRoleKeyId,
  changeInnerPauseValue,
  changeInnerPauseVariableId,
  changeRepeatActionValueType,
  changeRepeatRoleKeyId,
  changeRepeatValue,
  changeRepeatVariableId,
} from '../action-reducers';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyPressAction } from './send-key';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Inner Pause"
        actionValue={props.sendKeyPressAction.innerPause}
        actionValueTypeChangedFn={(type) =>
          changeInnerPauseActionValueType(type)
        }
        valueChangedFn={(value) => changeInnerPauseValue(value)}
        variableIdChangedFn={(id) => changeInnerPauseVariableId(id)}
        roleKeyIdChangedFn={(id) => changeInnerPauseRoleKeyId(id)}
      />
      <ActionValueComponent
        labelText="Repeat"
        actionValue={props.sendKeyPressAction.repeat}
        actionValueTypeChangedFn={(type) => changeRepeatActionValueType(type)}
        valueChangedFn={(value) => changeRepeatValue(value)}
        variableIdChangedFn={(id) => changeRepeatVariableId(id)}
        roleKeyIdChangedFn={(id) => changeRepeatRoleKeyId(id)}
      />
    </>
  );
};
