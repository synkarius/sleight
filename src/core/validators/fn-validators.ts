import { SleightDataInternalFormat } from '../../data/data-formats';
import {
  CallFunctionAction,
  isCallFunctionAction,
} from '../../data/model/action/call-function/call-function';
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
import { ValidateMode } from '../../validation/ValidationComponent';
import {
  createRoleKeyTakenValidator,
  createValidator,
} from '../../validation/validator-factories';
import { alwaysTrue, isEmpty, quote } from '../common/common-functions';
import { MapUtil } from '../common/map-util';

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
          message:
            'parameter names may only use alphanumeric characters and the underscore character',
          ids: invalidParameterIds,
        };
  },
};

const getActionsFnUsedIn = (
  fn: Fn,
  data: Readonly<SleightDataInternalFormat>
): CallFunctionAction[] =>
  Object.values(data.actions)
    .filter(isCallFunctionAction)
    .filter((action) => action.functionId === fn.id);

const fnUsedFnTypeChangedValidator: FieldValidator<Fn> = {
  validatorType: ValidatorType.FIELD,
  field: Field.FN_TYPE,
  isApplicable: alwaysTrue,
  validate: (fn, data) => {
    const actionsFnUsedIn = getActionsFnUsedIn(fn, data)
      .map((action) => quote(action.name))
      .join(', ');
    if (actionsFnUsedIn.length) {
      const fnFromData = MapUtil.getOrThrow(data.fns, fn.id);
      const typeChanged = fn.type !== fnFromData.type;
      if (typeChanged) {
        return {
          type: ValidationResultType.BASIC,
          field: Field.FN_PARAMETER_NAME,
          code: ValidationErrorCode.FN_USED_FN_TYPE_CHANGED,
          message:
            'cannot change function type since function is already used' +
            ` in Call Function Action(s): ${actionsFnUsedIn}`,
        };
      }
    }
    return validResult(Field.FN_TYPE);
  },
};

const getNumParamsChangedValidator = (
  field: Field.FN_ADD_NEW_PARAMETER | Field.FN_DELETE_PARAMETER
): FieldValidator<Fn> => {
  return {
    validatorType: ValidatorType.FIELD,
    field,
    isApplicable: alwaysTrue,
    validate: (fn, data) => {
      const actionsFnUsedIn = getActionsFnUsedIn(fn, data)
        .map((action) => quote(action.name))
        .join(', ');
      if (actionsFnUsedIn.length) {
        const fnFromData = MapUtil.getOrThrow(data.fns, fn.id);
        const numParamsChanged =
          fn.parameters.length !== fnFromData.parameters.length;
        if (numParamsChanged) {
          return {
            type: ValidationResultType.BASIC,
            field,
            code: ValidationErrorCode.FN_USED_CHANGED_NUM_PARAMS,
            message:
              'cannot change number of parameters since function is already used' +
              ` in Call Function Action(s): ${actionsFnUsedIn}`,
          };
        }
      }
      return validResult(field);
    },
  };
};

const fnUsedAddParamValidator = getNumParamsChangedValidator(
  Field.FN_ADD_NEW_PARAMETER
);
const fnUsedDeleteParamValidator = getNumParamsChangedValidator(
  Field.FN_DELETE_PARAMETER
);

const fnUsedParamTypeChangedValidator: FieldValidator<Fn> = {
  validatorType: ValidatorType.FIELDS,
  fields: [
    Field.FN_PARAMETER_TYPE,
    Field.FN_MOVE_PARAMETER,
    Field.FN_DELETE_PARAMETER,
  ],
  isApplicable: alwaysTrue,
  validate: (fn, data) => {
    // setup
    const actionsFnUsedIn = getActionsFnUsedIn(fn, data)
      .map((action) => quote(action.name))
      .join(', ');
    const paramsWithTypeChanged: string[] = [];

    // find params with types changed if fn is used
    if (actionsFnUsedIn.length) {
      const fnFromData = MapUtil.getOrThrow(data.fns, fn.id);
      for (let i = 0; i < fn.parameters.length; i++) {
        const newParamType = fn.parameters[i].type;
        const oldParamType = fnFromData.parameters[i]?.type;
        if (newParamType !== oldParamType) {
          paramsWithTypeChanged.push(fn.parameters[i].id);
        }
      }
    }

    return !paramsWithTypeChanged.length
      ? validResult(Field.FN_PARAMETER_TYPE)
      : {
          type: ValidationResultType.ID_LIST,
          field: Field.FN_PARAMETER_TYPE,
          code: ValidationErrorCode.FN_USED_CHANGED_PARAM_TYPE,
          message:
            'cannot change parameter type since function is already used' +
            ` in Call Function Action(s): ${actionsFnUsedIn}`,
          ids: paramsWithTypeChanged,
        };
  },
};

const deletionValidator: FieldValidator<Fn> = {
  validatorType: ValidatorType.FIELD,
  exclusiveValidationMode: ValidateMode.DELETE,
  field: Field.FN_DELETE,
  isApplicable: alwaysTrue,
  validate: (fn, data) => {
    const actionsFnUsedIn = getActionsFnUsedIn(fn, data)
      .map((action) => quote(action.name))
      .join(', ');
    return actionsFnUsedIn.length === 0
      ? validResult(Field.FN_DELETE)
      : {
          type: ValidationResultType.BASIC,
          field: Field.FN_DELETE,
          code: ValidationErrorCode.FN_USED_AND_DELETE_ATTEMPTED,
          message:
            'cannot delete: this function is used in call function action(s):' +
            ` ${actionsFnUsedIn}`,
        };
  },
};

export const getFnValidators = () => [
  nameNonEmptyValidator,
  nameNotStartsWithNumberValidator,
  roleKeyTakenValidator,
  parameterNameNotEmptyValidator,
  parameterNameNotStartsWithNumberValidator,
  // python functions:
  pythonFnNameCharactersValidator,
  pythonImportPathCharactersValidator,
  pythonImportPathFormatValidator,
  pythonParameterCharactersValidator,
  // fn used:
  fnUsedFnTypeChangedValidator,
  fnUsedAddParamValidator,
  fnUsedDeleteParamValidator,
  fnUsedParamTypeChangedValidator,
  deletionValidator,
];
