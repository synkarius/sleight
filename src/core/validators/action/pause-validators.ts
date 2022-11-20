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
 *                     SECONDS
 * =================================================
 */

const SECONDS = 'seconds';
const secondsValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_PAUSE_SECONDS_VAR,
    (action) => isPauseAction(action) && isVariableActionValue(action.seconds),
    (action) =>
      isPauseAction(action) &&
      isVariableActionValue(action.seconds) &&
      isIdSelected(action.seconds.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(SECONDS)
  ),
};

export const getPauseValidators = () => [...Object.values(secondsValidators)];
