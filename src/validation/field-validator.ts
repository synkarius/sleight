import { Field } from './validation-field';
import {
  ValidationResult,
  ValidationResultType,
  validResult,
} from './validation-result';
import { ValidationErrorCode } from './validation-error-code';
import { SleightDataInternalFormat } from '../data/data-formats';
import { Ided, Named } from '../features/domain';
import { alwaysTrue } from '../common/common-functions';
import { ValidateMode } from './ValidationComponent';

export enum ValidatorType {
  FIELD,
  FIELDS,
}

interface AbstractValidator<T> {
  readonly validatorType: ValidatorType;
  readonly isApplicable: (t: T) => boolean;
  readonly validate: (
    t: T,
    data: Readonly<SleightDataInternalFormat>
  ) => ValidationResult;
}

interface SingleFieldValidator<T> extends AbstractValidator<T> {
  readonly validatorType: typeof ValidatorType.FIELD;
  readonly field: Field;
  readonly exclusiveValidationMode?: ValidateMode;
}

interface FieldsValidator<T> extends AbstractValidator<T> {
  readonly validatorType: typeof ValidatorType.FIELDS;
  readonly fields: Field[];
}

export type FieldValidator<T> = SingleFieldValidator<T> | FieldsValidator<T>;

export const createValidator = <T>(
  field: Field,
  isApplicable: (t: T) => boolean,
  validateFn: (t: T) => boolean,
  code: ValidationErrorCode,
  message: string
): FieldValidator<T> => {
  return {
    validatorType: ValidatorType.FIELD,
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
    validatorType: ValidatorType.FIELD,
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
