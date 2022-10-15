import { Fn, isPythonFn } from '../../data/model/fn/fn';
import {
  FieldValidator,
  ValidatorType,
} from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../validation/validation-result';
import {
  createRoleKeyTakenValidator,
  createValidator,
} from '../../validation/validator-factories';
import { alwaysTrue, isEmpty } from '../common/common-functions';

const getStartsNumericRegex = () => /^[0-9]/;
const getAlphaNumAndUnderScoreOnlyRegex = () => /^[A-z0-9_]*$/;

const nameNonEmptyValidator: FieldValidator<Fn> = createValidator(
  Field.FN_NAME,
  alwaysTrue,
  (fn) => !isEmpty(fn.name),
  ValidationErrorCode.FN_NAME_EMPTY,
  'function name must not be empty'
);

const roleKeyTakenValidator = createRoleKeyTakenValidator<Fn, Fn>(
  Field.FN_ROLE_KEY,
  (data) => data.fns,
  'a function already exists with this role key',
  ValidationErrorCode.FN_RK_TAKEN
);

const nameNotStartsWithNumberValidator: FieldValidator<Fn> = createValidator(
  Field.FN_NAME,
  alwaysTrue,
  (fn) => !fn.name.match(getStartsNumericRegex()),
  ValidationErrorCode.FN_NAME_STARTS_NUM,
  'function name must not start with a number'
);

const pythonFnNameCharactersValidator: FieldValidator<Fn> = createValidator(
  Field.FN_NAME,
  isPythonFn,
  (fn) => !!fn.name.match(getAlphaNumAndUnderScoreOnlyRegex()),
  ValidationErrorCode.FN_NAME_INVALID_CHARS,
  'function name can only use alphanumeric characters and the underscore character'
);

const pythonImportPathCharactersValidator: FieldValidator<Fn> = createValidator(
  Field.FN_IMPORT_PATH,
  isPythonFn,
  (fn) => isPythonFn(fn) && !fn.importTokens.join('.').match(/[^A-z0-9.]/),
  ValidationErrorCode.FN_INVALID_IMPORT_PATH,
  'import path may only include alphanumeric chars and dots'
);

const pythonImportPathFormatValidator: FieldValidator<Fn> = createValidator(
  Field.FN_IMPORT_PATH,
  isPythonFn,
  (fn) => {
    const importPath = fn.importTokens.join('.');
    return !(
      importPath.startsWith('.') ||
      importPath.includes('..') ||
      importPath.endsWith('.') ||
      importPath.match(/\.[0-9]/) ||
      importPath.match(getStartsNumericRegex())
    );
  },
  ValidationErrorCode.FN_INVALID_IMPORT_PATH,
  'import path must follow python import format'
);

const parameterNameNotEmptyValidator: FieldValidator<Fn> = {
  validatorType: ValidatorType.FIELD,
  field: Field.FN_PARAMETER_NAME,
  isApplicable: alwaysTrue,
  validate: (fn) => {
    const invalidParameterIds = fn.parameters
      .filter((param) => isEmpty(param.name))
      .map((param) => param.id);
    return !invalidParameterIds.length
      ? validResult(Field.FN_PARAMETER_NAME)
      : {
          type: ValidationResultType.ID_LIST,
          field: Field.FN_PARAMETER_NAME,
          code: ValidationErrorCode.FN_PARAM_NAME_EMPTY,
          message: 'parameter names may not be empty',
          ids: invalidParameterIds,
        };
  },
};

const parameterNameNotStartsWithNumberValidator: FieldValidator<Fn> = {
  validatorType: ValidatorType.FIELD,
  field: Field.FN_PARAMETER_NAME,
  isApplicable: alwaysTrue,
  validate: (fn) => {
    const invalidParameterIds = fn.parameters
      .filter((param) => param.name.match(getStartsNumericRegex()))
      .map((param) => param.id);
    return !invalidParameterIds.length
      ? validResult(Field.FN_PARAMETER_NAME)
      : {
          type: ValidationResultType.ID_LIST,
          field: Field.FN_PARAMETER_NAME,
          code: ValidationErrorCode.FN_PARAM_STARTS_NUM,
          message: 'parameter names may not start with a number',
          ids: invalidParameterIds,
        };
  },
};

const pythonParameterCharactersValidator: FieldValidator<Fn> = {
  validatorType: ValidatorType.FIELD,
  field: Field.FN_PARAMETER_NAME,
  isApplicable: isPythonFn,
  validate: (fn) => {
    const invalidParameterIds = fn.parameters
      .filter((param) => !param.name.match(getAlphaNumAndUnderScoreOnlyRegex()))
      .map((param) => param.id);
    return !invalidParameterIds.length
      ? validResult(Field.FN_PARAMETER_NAME)
      : {
          type: ValidationResultType.ID_LIST,
          field: Field.FN_PARAMETER_NAME,
          code: ValidationErrorCode.FN_PARAM_STARTS_NUM,
          message: 'parameter names may not start with a number',
          ids: invalidParameterIds,
        };
  },
};

export const getFnValidators = () => [
  nameNonEmptyValidator,
  roleKeyTakenValidator,
  nameNotStartsWithNumberValidator,
  pythonFnNameCharactersValidator,
  pythonImportPathCharactersValidator,
  pythonImportPathFormatValidator,
  parameterNameNotEmptyValidator,
  parameterNameNotStartsWithNumberValidator,
  pythonParameterCharactersValidator,
];
