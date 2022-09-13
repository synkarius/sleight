import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value/action-value-type-name-group';

export const mouseKeyGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_MOUSE_BUTTON_RADIO,
  value: Field.AC_MOUSE_MOUSE_BUTTON_VALUE,
  variable: Field.AC_MOUSE_MOUSE_BUTTON_VAR,
};

export const pauseGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_PAUSE_RADIO,
  value: Field.AC_MOUSE_PAUSE_VALUE,
  variable: Field.AC_MOUSE_PAUSE_VAR,
};

export const repeatGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_REPEAT_RADIO,
  value: Field.AC_MOUSE_REPEAT_VALUE,
  variable: Field.AC_MOUSE_REPEAT_VAR,
};

export const directionGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_DIRECTION_RADIO,
  value: Field.AC_MOUSE_DIRECTION_VALUE,
  variable: Field.AC_MOUSE_DIRECTION_VAR,
};
