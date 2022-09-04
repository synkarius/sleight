import { isSelected } from '../../../../common/common-functions';
import { createValidator } from '../../../../validation/field-validator';
import { ValidationErrorCode } from '../../../../validation/validation-error-code';
import { Field } from '../../../../validation/validation-field';
import { isVariableActionValue } from '../action-value/action-value';
import {
  ActionValueValidators,
  createNonSelectedVariableError,
} from '../action-value/action-value-validation';
import { isPauseAction } from './pause';

/*
 * =================================================
 *                   CENTISECONDS
 * =================================================
 */

const CENTISECONDS = 'centiseconds';
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
};

export const getPauseValidators = () => [
  ...Object.values(centisecondsValidators),
];
