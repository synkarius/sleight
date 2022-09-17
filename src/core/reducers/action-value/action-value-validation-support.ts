import { FieldValidator } from '../../../validation/field-validator';
import { Action } from '../../../data/model/action/action';

export type ActionValueValidators = {
  readonly value?: FieldValidator<Action>;
  readonly variable: FieldValidator<Action>;
};

export const createEmptyError = (fieldName: String) =>
  fieldName + ' : value must be non-empty';
export const createNonSelectedEnumError = (fieldName: string) =>
  fieldName + ' : value must be selected';
export const createNonSelectedVariableError = (fieldName: string) =>
  fieldName + ' : variable must be selected';
