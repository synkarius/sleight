import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const mimicWordsGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.TEXT,
  radio: Field.AC_MIMIC_WORDS_RADIO,
  value: Field.AC_MIMIC_WORDS_VALUE,
  variable: Field.AC_MIMIC_WORDS_VAR,
};
