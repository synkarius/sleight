import React from 'react';
import { ActionValueComponent } from '../ActionValueComponent';
import { PauseAction } from '../../../../data/model/action/pause/pause';
import { pCentisecondsGroup } from './pause-action-value-field-group';

export const PauseComponent: React.FC<{ pauseAction: PauseAction }> = (
  props
) => {
  return (
    <ActionValueComponent
      actionValue={props.pauseAction.centiseconds}
      labelText="Centiseconds"
      descriptionText="time to pause in centiseconds"
      fields={pCentisecondsGroup}
    />
  );
};
