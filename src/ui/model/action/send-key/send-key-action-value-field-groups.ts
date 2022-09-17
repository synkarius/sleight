import { Direction } from '../../../../data/model/action/direction';
import { Key } from '../../../../data/model/action/send-key/key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const skKeyToSendGroup: ActionValueFieldGroup = {
  radio: Field.AC_SK_KEY_TO_SEND_RADIO,
  value: Field.AC_SK_KEY_TO_SEND_VALUE,
  variable: Field.AC_SK_KEY_TO_SEND_VAR,
  type: VariableType.Enum.ENUM,
  enumValues: Key.values(),
};

export const skOuterPauseGroup: ActionValueFieldGroup = {
  radio: Field.AC_SK_OUTER_PAUSE_RADIO,
  value: Field.AC_SK_OUTER_PAUSE_VALUE,
  variable: Field.AC_SK_OUTER_PAUSE_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};

export const skInnerPauseGroup: ActionValueFieldGroup = {
  radio: Field.AC_SK_INNER_PAUSE_RADIO,
  value: Field.AC_SK_INNER_PAUSE_VALUE,
  variable: Field.AC_SK_INNER_PAUSE_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};

export const skRepeatGroup: ActionValueFieldGroup = {
  radio: Field.AC_SK_REPEAT_RADIO,
  value: Field.AC_SK_REPEAT_VALUE,
  variable: Field.AC_SK_REPEAT_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};

export const skDirectionGroup: ActionValueFieldGroup = {
  radio: Field.AC_SK_DIRECTION_RADIO,
  value: Field.AC_SK_DIRECTION_VALUE,
  variable: Field.AC_SK_DIRECTION_VAR,
  type: VariableType.Enum.ENUM,
  enumValues: Direction.values(),
};
