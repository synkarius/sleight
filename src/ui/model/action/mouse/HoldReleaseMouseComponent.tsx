import React from 'react';
import { HoldReleaseMouseAction } from '../../../../data/model/action/mouse/mouse';
import { ActionValueComponent } from '../ActionValueComponent';
import {
  mDirectionGroup,
  mMouseButtonGroup,
  mPauseGroup,
} from './mouse-action-value-field-groups';

export const HoldReleaseMouseComponent: React.FC<{
  holdReleaseMouseAction: HoldReleaseMouseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.holdReleaseMouseAction.mouseButton}
        labelText="Mouse Button"
        descriptionText="which mouse button to hold/release"
        fields={mMouseButtonGroup}
      />
      <ActionValueComponent
        actionValue={props.holdReleaseMouseAction.pause}
        labelText="Pause"
        descriptionText="how long to pause after hold/release, in seconds"
        fields={mPauseGroup}
      />
      <ActionValueComponent
        actionValue={props.holdReleaseMouseAction.direction}
        labelText="Direction"
        descriptionText="hold (down) or release (up)"
        fields={mDirectionGroup}
      />
    </>
  );
};
