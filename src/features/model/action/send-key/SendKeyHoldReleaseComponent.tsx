import React from 'react';
import { ChoiceValueComponent } from '../action-value/ChoiceValueComponent';
import { SendKeyHoldReleaseAction } from './send-key';

export const SendKeyHoldReleaseComponent: React.FC<{
  sendKeyHoldReleaseAction: SendKeyHoldReleaseAction;
}> = (props) => {
  return (
    <>
      <ChoiceValueComponent
        labelText="Direction"
        choiceValue={props.sendKeyHoldReleaseAction.direction}
      />
    </>
  );
};
