import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const stTextGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.TEXT,
  radio: Field.AC_ST_TEXT_RADIO,
  value: Field.AC_ST_TEXT_VALUE,
  variable: Field.AC_ST_TEXT_VAR,
};
