import { UNSELECTED_ENUM } from '../../../core/common/consts';
import { getRandomId } from '../../../core/common/random-id';
import { Ided } from '../domain';
import { VariableType } from '../variable/variable-types';
import { ActionValueType } from './action-value-type';

interface AbstractActionValue extends Ided {
  /* this is how the user specifies the value in an action:
   * a value of ActionValueType
   */
  readonly actionValueType: ActionValueType.Type;
}

interface AbstractEnterValueActionValue extends AbstractActionValue {
  readonly actionValueType: typeof ActionValueType.Enum.ENTER_VALUE;
  readonly enteredValueType: VariableType.Type;
}

export const isEnterValueActionValue = (
  actionValue: AbstractActionValue
): actionValue is AbstractEnterValueActionValue =>
  actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE;

export interface EnterTextActionValue extends AbstractEnterValueActionValue {
  readonly enteredValueType: typeof VariableType.Enum.TEXT;
  readonly value: string;
}

export const isEnterTextActionValue = (
  actionValue: AbstractEnterValueActionValue
): actionValue is EnterTextActionValue =>
  actionValue.enteredValueType === VariableType.Enum.TEXT;

export interface EnterNumberActionValue extends AbstractEnterValueActionValue {
  readonly enteredValueType: typeof VariableType.Enum.NUMBER;
  readonly value: number;
}

export const isEnterNumberActionValue = (
  actionValue: AbstractEnterValueActionValue
): actionValue is EnterNumberActionValue =>
  actionValue.enteredValueType === VariableType.Enum.NUMBER;

export interface EnterEnumActionValue extends AbstractEnterValueActionValue {
  readonly enteredValueType: typeof VariableType.Enum.ENUM;
  readonly value: string;
}

export const isEnterEnumActionValue = (
  actionValue: AbstractEnterValueActionValue
): actionValue is EnterEnumActionValue =>
  actionValue.enteredValueType === VariableType.Enum.ENUM;

export interface AbstractVariableActionValue extends AbstractActionValue {
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
  readonly variableType: typeof VariableType.Enum.NUMBER;
}

export const isVariableRangeActionValue = (
  actionValue: AbstractVariableActionValue
): actionValue is VariableRangeActionValue =>
  actionValue.variableType === VariableType.Enum.NUMBER;

export interface VariableEnumActionValue extends AbstractVariableActionValue {
  readonly variableType: typeof VariableType.Enum.ENUM;
}

export const isVariableEnumActionValue = (
  actionValue: AbstractVariableActionValue
): actionValue is VariableEnumActionValue =>
  actionValue.variableType === VariableType.Enum.ENUM;

export type TextActionValue = EnterTextActionValue | VariableTextActionValue;

export type NumericActionValue =
  | EnterNumberActionValue
  | VariableRangeActionValue;

export type EnumActionValue = EnterEnumActionValue | VariableEnumActionValue;

export type ActionValue =
  | TextActionValue
  | NumericActionValue
  | EnumActionValue;

//========================================
//========================================
//========================================

export const createTextValue = (): EnterTextActionValue => {
  return {
    id: getRandomId(),
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    enteredValueType: VariableType.Enum.TEXT,
    value: '',
  };
};

export const createNumericValue = (): EnterNumberActionValue => {
  return {
    id: getRandomId(),
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    enteredValueType: VariableType.Enum.NUMBER,
    value: 0,
  };
};

export const createEnumValue = (): EnterEnumActionValue => {
  return {
    id: getRandomId(),
    actionValueType: ActionValueType.Enum.ENTER_VALUE,
    enteredValueType: VariableType.Enum.ENUM,
    value: UNSELECTED_ENUM,
  };
};

/**
 * EnterEnumActionValue can have its `value` set via dropdown or
 * text input. If it's the latter, the initial value should be blank
 * rather than `UNSELECTED_ENUM`.
 */
export const createHybridTextEnumValue = (): EnterEnumActionValue => ({
  ...createEnumValue(),
  value: '',
});
