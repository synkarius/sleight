import { SELECT_DEFAULT_VALUE } from '../../common/consts';
import { VariableType } from '../../variable/variable-types';
import { ActionValueType } from './action-value-type';

interface ActionValue {
  /* this is how the user specifies the value in an action:
   * a value of ActionValueType
   */
  readonly actionValueType: ActionValueType.Type;
}

interface VariableActionValue {
  // if the user has chosen variable binding, this is the variable type
  readonly variableType: VariableType.Type;
  // if the user has chosen variable binding, this is the variable id
  readonly variableId: string | null;
}

interface RoleKeyActionValue {
  // if the user has chosen role key binding, this is the role key id
  readonly roleKeyId: string | null;
}

export interface TextValue
  extends ActionValue,
    VariableActionValue,
    RoleKeyActionValue {
  readonly variableType: typeof VariableType.Enum.TEXT;
  readonly value: string | null;
}

export const createTextValue = (): TextValue => {
  return {
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    variableType: VariableType.Enum.TEXT,
    variableId: SELECT_DEFAULT_VALUE,
    roleKeyId: SELECT_DEFAULT_VALUE,
    value: '',
  };
};

export interface RangeValue
  extends ActionValue,
    VariableActionValue,
    RoleKeyActionValue {
  readonly variableType: typeof VariableType.Enum.RANGE;
  readonly value: number | null;
}

export const createRangeValue = (): RangeValue => {
  return {
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    variableType: VariableType.Enum.RANGE,
    variableId: SELECT_DEFAULT_VALUE,
    roleKeyId: SELECT_DEFAULT_VALUE,
    value: 0,
  };
};

export interface ChoiceValue
  extends ActionValue,
    VariableActionValue,
    RoleKeyActionValue {
  readonly variableType: typeof VariableType.Enum.CHOICE;
  readonly value: string | null;
}

export const createChoiceValue = (): ChoiceValue => {
  return {
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    variableType: VariableType.Enum.CHOICE,
    variableId: SELECT_DEFAULT_VALUE,
    roleKeyId: SELECT_DEFAULT_VALUE,
    value: '',
  };
};

export const withType = <T extends TextValue | RangeValue | ChoiceValue>(
  actionValue: T,
  type: ActionValueType.Type
): T => {
  return {
    ...actionValue,
    actionValueType: type,
  };
};
