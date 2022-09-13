import React from 'react';
import { Direction } from '../../../../data/model/action/direction';
import { HoldReleaseMouseAction } from '../../../../data/model/action/mouse/mouse';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import {
  directionGroup,
  pauseGroup,
} from './click-mouse-action-value-field-groups';

export const HoldReleaseMouseComponent: React.FC<{
  holdReleaseMouseAction: HoldReleaseMouseAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        actionValue={props.holdReleaseMouseAction.pause}
        labelText="Pause"
        descriptionText="how long to pause after clicking"
        fields={pauseGroup}
      />
      <ActionValueComponent
        actionValue={{
          ...props.holdReleaseMouseAction.direction,
          enumValues: Direction.values(),
        }}
        labelText="Direction"
        descriptionText="hold (down) or release (up)"
        fields={directionGroup}
      />
    </>
  );
};
