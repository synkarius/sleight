import { Field } from '../../../../validation/validation-field';
import { ActionValueTypeNameGroup } from '../action-value/action-value-type-name-group';

export const keyToSendGroup: ActionValueTypeNameGroup = {
  radio: Field.AC_KEY_TO_SEND_RADIO,
  value: Field.AC_KEY_TO_SEND_VALUE,
  variable: Field.AC_KEY_TO_SEND_VAR,
  roleKey: Field.AC_KEY_TO_SEND_RK,
};

export const outerPauseGroup: ActionValueTypeNameGroup = {
  radio: Field.AC_OUTER_PAUSE_RADIO,
  value: Field.AC_OUTER_PAUSE_VALUE,
  variable: Field.AC_OUTER_PAUSE_VAR,
  roleKey: Field.AC_OUTER_PAUSE_RK,
};

export const innerPauseGroup: ActionValueTypeNameGroup = {
  radio: Field.AC_INNER_PAUSE_RADIO,
  value: Field.AC_INNER_PAUSE_VALUE,
  variable: Field.AC_INNER_PAUSE_VAR,
  roleKey: Field.AC_INNER_PAUSE_RK,
};

export const repeatGroup: ActionValueTypeNameGroup = {
  radio: Field.AC_REPEAT_RADIO,
  value: Field.AC_REPEAT_VALUE,
  variable: Field.AC_REPEAT_VAR,
  roleKey: Field.AC_REPEAT_RK,
};

export const directionGroup: ActionValueTypeNameGroup = {
  radio: Field.AC_DIRECTION_RADIO,
  value: Field.AC_DIRECTION_VALUE,
  variable: Field.AC_DIRECTION_VAR,
  roleKey: Field.AC_DIRECTION_RK,
};
