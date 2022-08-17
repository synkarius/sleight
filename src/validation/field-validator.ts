import { Field } from './validation-field';
import {
  ErrorValidationResult,
  ValidationResult,
  ValidationResultType,
  validResult,
} from './validation-result';
import { ValidationErrorCode } from './validation-error-code';
import { SleightDataInternalFormat } from '../data/data-formats';
import { Ided, Named } from '../features/domain';
import { alwaysTrue } from '../util/common-functions';

export type FieldValidator<T> = {
  readonly field: Field;
  readonly isApplicable: (t: T) => boolean;
  readonly validate: (
    t: T,
    data: Readonly<SleightDataInternalFormat>
  ) => ValidationResult;
};

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
    validate: (t) => {
      if (validateFn(t)) {
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

export const createNameTakenValidator = <
  DTO extends Ided & Named,
  D extends Ided & Named
>(
  field: Field,
  extractFn: (data: SleightDataInternalFormat) => Readonly<Record<string, DTO>>,
  message: string,
  code: ValidationErrorCode
): FieldValidator<D> => {
  return {
    field: field,
    isApplicable: alwaysTrue,
    validate: (action, data): ValidationResult => {
      const duplicateExists = !!Object.values(extractFn(data))
        .filter((a) => a.id !== action.id)
        .find((a) => a.name === action.name);
      if (!duplicateExists) {
        return validResult(field);
      } else {
        return {
          type: ValidationResultType.BASIC,
          field,
          code,
          message,
        };
      }
    },
  };
};
