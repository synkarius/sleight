import { alwaysTrue } from '../core/common/common-functions';
import { SleightDataInternalFormat } from '../data/data-formats';
import { Ided, Named, RoleKeyed } from '../data/model/domain';
import { FieldValidator, ValidatorType } from './field-validator';
import { ValidationErrorCode } from './validation-error-code';
import { Field } from './validation-field';
import {
  ValidationResult,
  ValidationResultType,
  validResult,
} from './validation-result';

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
          errorHighlightField: field,
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
          errorHighlightField: field,
          code,
          message,
        };
      }
    },
  };
};

export const createRoleKeyTakenValidator = <
  DTO extends Ided & RoleKeyed,
  D extends Ided & RoleKeyed
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
        .filter((a) => a.roleKey !== '')
        .find((a) => a.roleKey === action.roleKey);
      if (!duplicateExists) {
        return validResult(field);
      } else {
        return {
          type: ValidationResultType.BASIC,
          errorHighlightField: field,
          code,
          message,
        };
      }
    },
  };
};
