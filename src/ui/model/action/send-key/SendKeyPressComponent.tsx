import React from 'react';
import { ActionValueComponent } from '../ActionValueComponent';
import { SendKeyPressAction } from '../../../../data/model/action/send-key/send-key';
import {
  skInnerPauseGroup,
  skRepeatGroup,
} from './send-key-action-value-field-groups';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.innerPause}
        labelText="Inner Pause"
        descriptionText="time to pause between repetitions of keystroke, in seconds"
        fields={skInnerPauseGroup}
      />
      <ActionValueComponent
        actionValue={props.sendKeyPressAction.repeat}
        labelText="Repeat"
        descriptionText="times to repeat keystroke"
        fields={skRepeatGroup}
      />
    </>
  );
};
