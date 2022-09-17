import React from 'react';
import { SendTextAction } from '../../../../data/model/action/send-text/send-text';
import { ActionValueComponent } from '../ActionValueComponent';
import { stTextGroup } from './send-text-action-value-field-group';

export const SendTextComponent: React.FC<{ sendTextAction: SendTextAction }> = (
  props
) => {
  return (
    <ActionValueComponent
      labelText="Text"
      descriptionText="the text to send"
      actionValue={props.sendTextAction.text}
      fields={stTextGroup}
    />
  );
};
