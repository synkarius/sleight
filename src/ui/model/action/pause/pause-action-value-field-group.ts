import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const pSecondsGroup: ActionValueFieldGroup = {
  radio: Field.AC_PAUSE_SECONDS_RADIO,
  value: Field.AC_PAUSE_SECONDS_VALUE,
  variable: Field.AC_PAUSE_SECONDS_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};
