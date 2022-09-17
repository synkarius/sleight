import { isIdSelected } from '../../common/common-functions';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import { isVariableActionValue } from '../../../data/model/action/action-value';
import {
  ActionValueValidators,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';
import { isPauseAction } from '../../../data/model/action/pause/pause';

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
      isIdSelected(action.centiseconds.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(CENTISECONDS)
  ),
};

export const getPauseValidators = () => [
  ...Object.values(centisecondsValidators),
];
