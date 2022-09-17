import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const pCentisecondsGroup: ActionValueFieldGroup = {
  radio: Field.AC_CENTISECONDS_RADIO,
  value: Field.AC_CENTISECONDS_VALUE,
  variable: Field.AC_CENTISECONDS_VAR,
  type: VariableType.Enum.NUMBER,
  min: 0,
};
