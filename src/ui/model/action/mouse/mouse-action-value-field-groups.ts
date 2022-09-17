import { Direction } from '../../../../data/model/action/direction';
import { MouseKey } from '../../../../data/model/action/mouse/mouse-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const mMoveXGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_X_RADIO,
  value: Field.AC_MOUSE_X_VALUE,
  variable: Field.AC_MOUSE_X_VAR,
  type: VariableType.Enum.NUMBER,
};

export const mMoveYGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_Y_RADIO,
  value: Field.AC_MOUSE_Y_VALUE,
  variable: Field.AC_MOUSE_Y_VAR,
  type: VariableType.Enum.NUMBER,
};

export const mMouseKeyGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_MOUSE_BUTTON_RADIO,
  value: Field.AC_MOUSE_MOUSE_BUTTON_VALUE,
  variable: Field.AC_MOUSE_MOUSE_BUTTON_VAR,
  type: VariableType.Enum.ENUM,
  enumValues: MouseKey.values(),
};

export const mPauseGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_PAUSE_RADIO,
  value: Field.AC_MOUSE_PAUSE_VALUE,
  variable: Field.AC_MOUSE_PAUSE_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};

export const mRepeatGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_REPEAT_RADIO,
  value: Field.AC_MOUSE_REPEAT_VALUE,
  variable: Field.AC_MOUSE_REPEAT_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};

export const mDirectionGroup: ActionValueFieldGroup = {
  radio: Field.AC_MOUSE_DIRECTION_RADIO,
  value: Field.AC_MOUSE_DIRECTION_VALUE,
  variable: Field.AC_MOUSE_DIRECTION_VAR,
  type: VariableType.Enum.ENUM,
  enumValues: Direction.values(),
};
