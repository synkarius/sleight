import React from 'react';
import { ClickMouseAction } from '../../../../data/model/action/mouse/mouse';
import { MouseKey } from '../../../../data/model/action/mouse/mouse-key';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import {
  mouseKeyGroup,
  pauseGroup,
  repeatGroup,
} from './click-mouse-action-value-field-groups';

export const ClickMouseComponent: React.FC<{
  clickMouseAction: ClickMouseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={{
          ...props.clickMouseAction.mouseKey,
          enumValues: MouseKey.values(),
        }}
        labelText="Mouse Button"
        descriptionText="which mouse button to click"
        fields={mouseKeyGroup}
      />
      <ActionValueComponent
        actionValue={props.clickMouseAction.pause}
        labelText="Pause"
        descriptionText="how long to pause after clicking"
        fields={pauseGroup}
      />
      <ActionValueComponent
        actionValue={props.clickMouseAction.repeat}
        labelText="Repeat"
        descriptionText="how many times to repeat the click"
        fields={repeatGroup}
      />
    </>
  );
};
