import React from 'react';
import { ClickMouseAction } from '../../../../data/model/action/mouse/mouse';
import { ActionValueComponent } from '../ActionValueComponent';
import {
  mMouseButtonGroup,
  mPauseGroup,
  mRepeatGroup,
} from './mouse-action-value-field-groups';

export const ClickMouseComponent: React.FC<{
  clickMouseAction: ClickMouseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.clickMouseAction.mouseButton}
        labelText="Mouse Button"
        descriptionText="which mouse button to click"
        fields={mMouseButtonGroup}
      />
      <ActionValueComponent
        actionValue={props.clickMouseAction.pause}
        labelText="Pause"
        descriptionText="how long to pause after clicking"
        fields={mPauseGroup}
      />
      <ActionValueComponent
        actionValue={props.clickMouseAction.repeat}
        labelText="Repeat"
        descriptionText="how many times to repeat the click"
        fields={mRepeatGroup}
      />
    </>
  );
};
