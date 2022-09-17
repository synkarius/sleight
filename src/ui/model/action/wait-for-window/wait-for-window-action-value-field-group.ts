import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const wfwTitleGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.ENUM,
  radio: Field.AC_WFW_TITLE_RADIO,
  value: Field.AC_WFW_TITLE_VALUE,
  variable: Field.AC_WFW_TITLE_VAR,
  enumValues: [],
};

export const wfwExecutableGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.ENUM,
  radio: Field.AC_WFW_EXECUTABLE_RADIO,
  value: Field.AC_WFW_EXECUTABLE_VALUE,
  variable: Field.AC_WFW_EXECUTABLE_VAR,
  enumValues: [],
};

export const wfwWaitSecondsGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.NUMBER,
  radio: Field.AC_WFW_WAIT_SECONDS_RADIO,
  value: Field.AC_WFW_WAIT_SECONDS_VALUE,
  variable: Field.AC_WFW_WAIT_SECONDS_VAR,
  min: 0,
};
