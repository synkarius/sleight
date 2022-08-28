import { isSelected } from '../../../../util/common-functions';
import {
  createValidator,
  ValidatorType,
} from '../../../../validation/field-validator';
import { ValidationErrorCode } from '../../../../validation/validation-error-code';
import { Field } from '../../../../validation/validation-field';
import { validResult } from '../../../../validation/validation-result';
import { VariableType } from '../../variable/variable-types';
import {
  isRoleKeyActionValue,
  isVariableActionValue,
} from '../action-value/action-value';
import {
  ActionValueValidators,
  createNonSelectedRoleKeyError,
  createNonSelectedVariableError,
  getRoleKeyExistsError,
} from '../action-value/action-value-validation';
import { isPauseAction } from './pause';

/*
 * =================================================
 *                   CENTISECONDS
 * =================================================
 */

const CENTISECONDS = 'centiseconds';
const CS_RK = Field.AC_CENTISECONDS_RK;
const centisecondsValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_CENTISECONDS_VAR,
    (action) =>
      isPauseAction(action) && isVariableActionValue(action.centiseconds),
    (action) =>
      isPauseAction(action) &&
      isVariableActionValue(action.centiseconds) &&
      isSelected(action.centiseconds.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(CENTISECONDS)
  ),
  roleKeySelected: createValidator(
    CS_RK,
    (action) =>
      isPauseAction(action) && isRoleKeyActionValue(action.centiseconds),
    (action) =>
      isPauseAction(action) &&
      isRoleKeyActionValue(action.centiseconds) &&
      isSelected(action.centiseconds.roleKeyId),
    ValidationErrorCode.AC_AV_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(CENTISECONDS)
  ),
  roleKeyedElementExists: {
    validatorType: ValidatorType.FIELD,
    field: CS_RK,
    isApplicable: (action) =>
      isPauseAction(action) && isRoleKeyActionValue(action.centiseconds),
    validate: (action, data) => {
      if (isPauseAction(action) && isRoleKeyActionValue(action.centiseconds)) {
        const errorResult = getRoleKeyExistsError(
          CS_RK,
          VariableType.Enum.RANGE,
          action.centiseconds,
          data.variables
        );
        if (errorResult) {
          return errorResult;
        }
      }
      return validResult(CS_RK);
    },
  },
};

export const getPauseValidators = () => [
  ...Object.values(centisecondsValidators),
];
