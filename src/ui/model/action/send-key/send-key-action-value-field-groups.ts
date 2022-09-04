import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value/action-value-type-name-group';

export const keyToSendGroup: ActionValueFieldGroup = {
  radio: Field.AC_KEY_TO_SEND_RADIO,
  value: Field.AC_KEY_TO_SEND_VALUE,
  variable: Field.AC_KEY_TO_SEND_VAR,
};

export const outerPauseGroup: ActionValueFieldGroup = {
  radio: Field.AC_OUTER_PAUSE_RADIO,
  value: Field.AC_OUTER_PAUSE_VALUE,
  variable: Field.AC_OUTER_PAUSE_VAR,
};

export const innerPauseGroup: ActionValueFieldGroup = {
  radio: Field.AC_INNER_PAUSE_RADIO,
  value: Field.AC_INNER_PAUSE_VALUE,
  variable: Field.AC_INNER_PAUSE_VAR,
};

export const repeatGroup: ActionValueFieldGroup = {
  radio: Field.AC_REPEAT_RADIO,
  value: Field.AC_REPEAT_VALUE,
  variable: Field.AC_REPEAT_VAR,
};

export const directionGroup: ActionValueFieldGroup = {
  radio: Field.AC_DIRECTION_RADIO,
  value: Field.AC_DIRECTION_VALUE,
  variable: Field.AC_DIRECTION_VAR,
};
