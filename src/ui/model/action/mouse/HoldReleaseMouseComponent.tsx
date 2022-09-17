import React from 'react';
import { HoldReleaseMouseAction } from '../../../../data/model/action/mouse/mouse';
import { ActionValueComponent } from '../ActionValueComponent';
import {
  mDirectionGroup,
  mPauseGroup,
} from './mouse-action-value-field-groups';

export const HoldReleaseMouseComponent: React.FC<{
  holdReleaseMouseAction: HoldReleaseMouseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.holdReleaseMouseAction.pause}
        labelText="Pause"
        descriptionText="how long to pause after clicking"
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
