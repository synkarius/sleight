import { SELECT_DEFAULT_VALUE } from '../../../../core/common/consts';
import { VariableType } from '../../variable/variable-types';
import { ActionValueType } from './action-value-type';

interface AbstractActionValue {
  /* this is how the user specifies the value in an action:
   * a value of ActionValueType
   */
  readonly actionValueType: ActionValueType.Type;
}

export enum EnterValueType {
  TEXT,
  NUMERIC,
  ENUM,
}

interface AbstractEnterValueActionValue extends AbstractActionValue {
  readonly actionValueType: typeof ActionValueType.Enum.ENTER_VALUE;
  readonly enteredValueType: EnterValueType;
}

export const isEnterValueActionValue = (
  actionValue: AbstractActionValue
): actionValue is AbstractEnterValueActionValue =>
  actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE;

interface EnterTextActionValue extends AbstractEnterValueActionValue {
  readonly enteredValueType: typeof EnterValueType.TEXT;
  readonly value: string;
}

export const isEnterTextActionValue = (
  actionValue: AbstractEnterValueActionValue
): actionValue is EnterTextActionValue =>
  actionValue.enteredValueType === EnterValueType.TEXT;

interface EnterNumberActionValue extends AbstractEnterValueActionValue {
  readonly enteredValueType: typeof EnterValueType.NUMERIC;
  readonly value: number;
}

export const isEnterNumberActionValue = (
  actionValue: AbstractEnterValueActionValue
): actionValue is EnterNumberActionValue =>
  actionValue.enteredValueType === EnterValueType.NUMERIC;

interface EnterEnumActionValue extends AbstractEnterValueActionValue {
  readonly enteredValueType: typeof EnterValueType.ENUM;
  readonly value: string;
}

export const isEnterEnumActionValue = (
  actionValue: AbstractEnterValueActionValue
): actionValue is EnterEnumActionValue =>
  actionValue.enteredValueType === EnterValueType.ENUM;

interface AbstractVariableActionValue extends AbstractActionValue {
  readonly actionValueType: typeof ActionValueType.Enum.USE_VARIABLE;
  // if the user has chosen variable binding, this is the variable type
  readonly variableType: VariableType.Type;
  // if the user has chosen variable binding, this is the variable id
  readonly variableId: string;
}

export const isVariableActionValue = (
  actionValue: AbstractActionValue
): actionValue is AbstractVariableActionValue =>
  actionValue.actionValueType === ActionValueType.Enum.USE_VARIABLE;

export interface VariableTextActionValue extends AbstractVariableActionValue {
  readonly variableType: typeof VariableType.Enum.TEXT;
}

export const isVariableTextActionValue = (
  actionValue: AbstractVariableActionValue
): actionValue is VariableTextActionValue =>
  actionValue.variableType === VariableType.Enum.TEXT;

export interface VariableRangeActionValue extends AbstractVariableActionValue {
  readonly variableType: typeof VariableType.Enum.RANGE;
}

export const isVariableRangeActionValue = (
  actionValue: AbstractVariableActionValue
): actionValue is VariableRangeActionValue =>
  actionValue.variableType === VariableType.Enum.RANGE;

export interface VariableChoiceActionValue extends AbstractVariableActionValue {
  readonly variableType: typeof VariableType.Enum.CHOICE;
}

export const isVariableChoiceActionValue = (
  actionValue: AbstractVariableActionValue
): actionValue is VariableChoiceActionValue =>
  actionValue.variableType === VariableType.Enum.CHOICE;

export type TextActionValue = EnterTextActionValue | VariableTextActionValue;

export type NumericActionValue =
  | EnterNumberActionValue
  | VariableRangeActionValue;

export type EnumActionValue = EnterEnumActionValue | VariableChoiceActionValue;

//========================================
//========================================
//========================================

export const createTextValue = (): EnterTextActionValue => {
  return {
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    enteredValueType: EnterValueType.TEXT,
    value: '',
  };
};

export const createNumericValue = (): EnterNumberActionValue => {
  return {
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    enteredValueType: EnterValueType.NUMERIC,
    value: 0,
  };
};

export const createEnumValue = (): EnterEnumActionValue => {
  return {
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    enteredValueType: EnterValueType.ENUM,
    value: SELECT_DEFAULT_VALUE,
  };
};
