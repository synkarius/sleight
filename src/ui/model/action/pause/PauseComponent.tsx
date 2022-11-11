import React from 'react';
import { ActionValueComponent } from '../ActionValueComponent';
import { PauseAction } from '../../../../data/model/action/pause/pause';
import { pSecondsGroup } from './pause-action-value-field-group';

export const PauseComponent: React.FC<{ pauseAction: PauseAction }> = (
  props
) => {
  return (
    <ActionValueComponent
      actionValue={props.pauseAction.seconds}
      labelText="Seconds"
      descriptionText="time to pause in seconds"
      fields={pSecondsGroup}
    />
  );
};
