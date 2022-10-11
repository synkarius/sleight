import { Fn, isPythonFn } from '../../data/model/fn/fn';
import { WrongTypeError } from '../../error/wrong-type-error';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import { createValidator } from '../../validation/validator-factories';
import { alwaysTrue, isEmpty } from '../common/common-functions';

const nameNonEmptyValidator: FieldValidator<Fn> = createValidator(
  Field.FN_NAME,
  alwaysTrue,
  (fn) => !isEmpty(fn.name),
  ValidationErrorCode.FN_NAME_EMPTY,
  'function name must not be empty'
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
    if (isPythonFn(fn)) {
      const importPath = fn.importTokens.join('.');
      return !(
        importPath.startsWith('.') ||
        importPath.endsWith('.') ||
        importPath.match(/\.[0-9]/) ||
        importPath.match(/^[0-9]/)
      );
    }
    throw new WrongTypeError(fn.type);
  },
  ValidationErrorCode.FN_INVALID_IMPORT_PATH,
  'import path must follow python import format'
);

export const getFnValidators = () => [
  nameNonEmptyValidator,
  pythonImportPathCharactersValidator,
  pythonImportPathFormatValidator,
];
