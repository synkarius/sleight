import React from 'react';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { PauseAction } from './pause';
import { centisecondsGroup } from './pause-action-value-field-group';

export const PauseComponent: React.FC<{ pauseAction: PauseAction }> = (
  props
) => {
  return (
    <ActionValueComponent
      actionValue={props.pauseAction.centiseconds}
      labelText="Centiseconds"
      descriptionText="time to pause in centiseconds"
      fields={centisecondsGroup}
    />
  );
};
