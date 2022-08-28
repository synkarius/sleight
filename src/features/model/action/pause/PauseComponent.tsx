import React from 'react';
import { Field } from '../../../../validation/validation-field';
import { ActionValueComponent } from '../action-value/ActionValueComponent';
import { PauseAction } from './pause';

export const PauseComponent: React.FC<{ pauseAction: PauseAction }> = (
  props
) => {
  return (
    <ActionValueComponent
      actionValue={props.pauseAction.centiseconds}
      labelText="Centiseconds"
      descriptionText="time to pause in centiseconds"
      fields={{
        radio: Field.AC_CENTISECONDS_RADIO,
        value: Field.AC_CENTISECONDS_VALUE,
        variable: Field.AC_CENTISECONDS_VAR,
        roleKey: Field.AC_CENTISECONDS_RK,
      }}
    />
  );
};
