import React from 'react';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyHoldReleaseAction } from './send-key';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      {/* <ActionValueComponent
        labelText="Direction"
        actionValue={props.sendKeyHoldReleaseAction.direction}
        actionValueTypeChangedFn={}
        valueChangedFn={}
        variableIdChangedFn={}
        roleKeyIdChangedFn={}
      /> */}
    </>
  );
};
