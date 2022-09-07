import React from 'react';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { SendKeyPressAction } from '../../../../data/model/action/send-key/send-key';
import {
  innerPauseGroup,
  repeatGroup,
} from './send-key-action-value-field-groups';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.innerPause}
        labelText="Inner Pause"
        descriptionText="time to pause between repetitions of keystroke, in centiseconds"
        fields={innerPauseGroup}
      />
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.repeat}
        labelText="Repeat"
        descriptionText="times to repeat keystroke"
        fields={repeatGroup}
      />
    </>
  );
};
