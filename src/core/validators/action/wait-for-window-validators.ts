import { Action } from '../../../data/model/action/action';
import { isVariableActionValue } from '../../../data/model/action/action-value';
import { isWaitForWindowAction } from '../../../data/model/action/wait-for-window/wait-for-window';
import { FieldValidator } from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import { isDefined, isIdSelected } from '../../common/common-functions';
import {
  ActionValueValidators,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';

/*
 * =================================================
 *                    EXECUTABLE
 * =================================================
 */

const EXECUTABLE = 'executable';
const appPathValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_WFW_EXECUTABLE_VAR,
    (action) =>
      isWaitForWindowAction(action) && isVariableActionValue(action.executable),
    (action) =>
      isWaitForWindowAction(action) &&
      isVariableActionValue(action.executable) &&
      isIdSelected(action.executable.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(EXECUTABLE)
  ),
};

/*
 * =================================================
 *                      TITLE
 * =================================================
 */

const TITLE = 'title';
const titleValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_WFW_TITLE_VAR,
    (action) =>
      isWaitForWindowAction(action) && isVariableActionValue(action.title),
    (action) =>
      isWaitForWindowAction(action) &&
      isVariableActionValue(action.title) &&
      isIdSelected(action.title.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(TITLE)
  ),
};

/*
 * =================================================
 *                   WAIT SECONDS
 * =================================================
 */

const WAIT_SECONDS = 'wait seconds';
const waitSecondsValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_WFW_WAIT_SECONDS_VAR,
    (action) =>
      isWaitForWindowAction(action) &&
      isVariableActionValue(action.waitSeconds),
    (action) =>
      isWaitForWindowAction(action) &&
      isVariableActionValue(action.waitSeconds) &&
      isIdSelected(action.waitSeconds.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(WAIT_SECONDS)
  ),
};

export const getWaitForWindowValidators: () => FieldValidator<Action>[] = () =>
  [
    ...Object.values(appPathValidators),
    ...Object.values(titleValidators),
    ...Object.values(waitSecondsValidators),
  ].filter(isDefined);
