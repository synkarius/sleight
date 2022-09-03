import { FieldValidator } from '../../../../validation/field-validator';
import { Action } from '../action';

export type ActionValueValidators = {
  readonly value?: FieldValidator<Action>;
  readonly variable: FieldValidator<Action>;
};

export const createNonSelectedEnumError = (fieldName: string) =>
  fieldName + ' : value must be selected';
export const createNonSelectedVariableError = (fieldName: string) =>
  fieldName + ' : variable must be selected';
