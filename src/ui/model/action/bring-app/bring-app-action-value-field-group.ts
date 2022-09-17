import { VariableType } from '../../../../data/model/variable/variable-types';
import { Field } from '../../../../validation/validation-field';
import { ActionValueFieldGroup } from '../action-value-type-name-group';

export const bringAppPathGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.ENUM,
  radio: Field.AC_BRING_PATH_RADIO,
  value: Field.AC_BRING_PATH_VALUE,
  variable: Field.AC_BRING_PATH_VAR,
  enumValues: [],
};

export const bringAppTitleGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.ENUM,
  radio: Field.AC_BRING_TITLE_RADIO,
  value: Field.AC_BRING_TITLE_VALUE,
  variable: Field.AC_BRING_TITLE_VAR,
  enumValues: [],
};

export const bringAppStarDirGroup: ActionValueFieldGroup = {
  type: VariableType.Enum.ENUM,
  radio: Field.AC_BRING_START_DIR_RADIO,
  value: Field.AC_BRING_START_DIR_VALUE,
  variable: Field.AC_BRING_START_DIR_VAR,
  enumValues: [],
};
