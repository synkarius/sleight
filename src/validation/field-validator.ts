import { Field } from './validation-field';
import {
  ErrorValidationResult,
  ValidationResult,
  ValidationResultType,
  validResult,
} from './validation-result';
import { ValidationErrorCode } from './validation-error-code';

export interface FieldValidator<T> {
  readonly field: Field;
  readonly isApplicable: (t: T) => boolean;
  readonly validate: (t: T) => ValidationResult;
}

/**
 * To be used in tsx files to get the error message where
 * multiple validators apply.
 * @param errorResults
 * @param validators
 * @returns
 */
export const getRelevantErrorMessage = (
  errorResults: ErrorValidationResult[],
  fields: Field[]
): string | undefined => {
  for (let i = 0; i < fields.length; i++) {
    for (let k = 0; k < errorResults.length; k++) {
      if (fields[i] === errorResults[k].field) {
        return errorResults[k].message;
      }
    }
  }
  return undefined;
};

export const createValidator = <T>(
  field: Field,
  isApplicable: (t: T) => boolean,
  validateFn: (t: T) => boolean,
  code: ValidationErrorCode,
  message: string
): FieldValidator<T> => {
  return {
    field: field,
    isApplicable: isApplicable,
    validate: (spec) => {
      if (validateFn(spec)) {
        return validResult(field);
      } else {
        return {
          type: ValidationResultType.BASIC,
          field: field,
          code: code,
          message: message,
        };
      }
    },
  };
};
