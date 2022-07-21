import { alwaysFalse, alwaysTrue } from '../../../../util/common-functions';
import { createFilterMap } from '../../../../util/filter-map';
import {
  createFieldValidator,
  FieldValidator,
} from '../../../../validation/field-validator';
import { Field } from '../../../../validation/validation-field';
import { createValidationError } from '../../../../validation/validator';
import { Action } from '../action';
import { ChoiceValue, RangeValue, TextValue } from './action-value';
import { ActionValueType } from './action-value-type';

export type TextValued = TextValue | ChoiceValue;
export type IdValued = TextValued | RangeValue;

export interface ActionValueValidators {
  radioGroupField: Field;
  value: FieldValidator<Action>;
  variable: FieldValidator<Action>;
  roleKey: FieldValidator<Action>;
}

export const createNonEmptyError = (fieldName: string) =>
  createValidationError(fieldName + " : can't be empty");
export const createNonSelectedVariableError = (fieldName: string) =>
  createValidationError(fieldName + ' : variable must be selected');
export const createNonSelectedRoleKeyError = (fieldName: string) =>
  createValidationError(fieldName + ' : role key must be selected');

export const toEnteredValueFM = createFilterMap(
  (actionValue: TextValue | ChoiceValue) =>
    ActionValueType.ENTER_VALUE === actionValue.actionValueType,
  (actionValue: TextValue | ChoiceValue) => actionValue.value as string
);
export const toVariableIdFM = createFilterMap(
  (actionValue: TextValue | RangeValue | ChoiceValue) =>
    ActionValueType.USE_VARIABLE === actionValue.actionValueType,
  (actionValue: TextValue | RangeValue | ChoiceValue) =>
    actionValue.variableId as string
);
export const toRoleKeyIdFM = createFilterMap(
  (actionValue: TextValue | RangeValue | ChoiceValue) =>
    ActionValueType.USE_ROLE_KEY === actionValue.actionValueType,
  (actionValue: TextValue | RangeValue | ChoiceValue) =>
    actionValue.roleKeyId as string
);

export const createNoOpValidator = (field: Field): FieldValidator<Action> =>
  createFieldValidator(
    field,
    alwaysFalse,
    alwaysTrue,
    createValidationError('no-op error: should never happen')
  );
