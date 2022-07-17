import { Field } from './validation-field';
import { ValidationError, Validator } from './validator';

export interface FieldValidator<T> extends Validator<T> {
  readonly field: Field;
  readonly isApplicable: (t: T) => boolean;
}

export const createFieldValidator = <T>(
  field: Field,
  isApplicable: (t: T) => boolean,
  isValid: (t: T) => boolean,
  error: ValidationError
): FieldValidator<T> => {
  return {
    field: field,
    isApplicable: isApplicable,
    isValid: isValid,
    error: error,
  };
};
