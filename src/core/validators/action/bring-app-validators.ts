import { Action } from '../../../data/model/action/action';
import {
  isEnterEnumActionValue,
  isVariableActionValue,
} from '../../../data/model/action/action-value';
import { isBringAppAction } from '../../../data/model/action/bring-app/bring-app';
import { FieldValidator } from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import {
  isDefined,
  isIdSelected,
  notEmpty,
} from '../../common/common-functions';
import {
  ActionValueValidators,
  createEmptyError,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';

/*
 * =================================================
 *                     APP PATH
 * =================================================
 */

const APP_PATH = 'app path';
const appPathValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_BRING_PATH_VALUE,
    (action) =>
      isBringAppAction(action) &&
      !isVariableActionValue(action.appPath) &&
      isEnterEnumActionValue(action.appPath),
    (action) =>
      isBringAppAction(action) &&
      !isVariableActionValue(action.appPath) &&
      isEnterEnumActionValue(action.appPath) &&
      notEmpty(action.appPath.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createEmptyError(APP_PATH)
  ),
  variable: createValidator(
    Field.AC_BRING_PATH_VAR,
    (action) =>
      isBringAppAction(action) && isVariableActionValue(action.appPath),
    (action) =>
      isBringAppAction(action) &&
      isVariableActionValue(action.appPath) &&
      isIdSelected(action.appPath.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(APP_PATH)
  ),
};

/*
 * =================================================
 *                     APP TITLE
 * =================================================
 */

const APP_TITLE = 'app title';
const appTitleValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_BRING_TITLE_VAR,
    (action) =>
      isBringAppAction(action) && isVariableActionValue(action.appTitle),
    (action) =>
      isBringAppAction(action) &&
      isVariableActionValue(action.appTitle) &&
      isIdSelected(action.appTitle.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(APP_TITLE)
  ),
};

/*
 * =================================================
 *                    START DIR
 * =================================================
 */

const START_DIR = 'start dir';
const startDirValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_BRING_START_DIR_VAR,
    (action) =>
      isBringAppAction(action) && isVariableActionValue(action.startDir),
    (action) =>
      isBringAppAction(action) &&
      isVariableActionValue(action.startDir) &&
      isIdSelected(action.startDir.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(START_DIR)
  ),
};

export const getBringAppValidators: () => FieldValidator<Action>[] = () =>
  [
    ...Object.values(appPathValidators),
    ...Object.values(appTitleValidators),
    ...Object.values(startDirValidators),
  ].filter(isDefined);
