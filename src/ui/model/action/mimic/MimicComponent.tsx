import React from 'react';
import { MimicAction } from '../../../../data/model/action/mimic/mimic';
import { ActionValueComponent } from '../ActionValueComponent';
import { mimicWordsGroup } from './mimic-action-value-field-group';

export const MimicComponent: React.FC<{ mimicAction: MimicAction }> = (
  props
) => {
  return (
    <ActionValueComponent
      labelText="Words"
      descriptionText="words to mimic"
      actionValue={props.mimicAction.words}
      fields={mimicWordsGroup}
    />
  );
};
