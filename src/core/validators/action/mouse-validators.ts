import { Action } from '../../../data/model/action/action';
import {
  isEnterEnumActionValue,
  isVariableActionValue,
} from '../../../data/model/action/action-value';
import {
  isClickMouseAction,
  isHoldReleaseMouseAction,
  isMouseAction,
  isMoveMouseAction,
} from '../../../data/model/action/mouse/mouse';
import { FieldValidator } from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import {
  isDefined,
  isEnumSelected,
  isIdSelected,
} from '../../common/common-functions';
import {
  ActionValueValidators,
  createNonSelectedEnumError,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';

/*
 * =================================================
 *                   MOVE X VALUE
 * =================================================
 */

const X_VALUE = 'x value';
const moveXValueValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_MOUSE_X_VAR,
    (action) =>
      isMouseAction(action) &&
      isMoveMouseAction(action) &&
      isVariableActionValue(action.x),
    (action) =>
      isMouseAction(action) &&
      isMoveMouseAction(action) &&
      isVariableActionValue(action.x) &&
      isIdSelected(action.x.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(X_VALUE)
  ),
};

/*
 * =================================================
 *                   MOVE Y VALUE
 * =================================================
 */

const Y_VALUE = 'y value';
const moveYValueValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_MOUSE_Y_VAR,
    (action) =>
      isMouseAction(action) &&
      isMoveMouseAction(action) &&
      isVariableActionValue(action.y),
    (action) =>
      isMouseAction(action) &&
      isMoveMouseAction(action) &&
      isVariableActionValue(action.y) &&
      isIdSelected(action.y.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(Y_VALUE)
  ),
};

/*
 * =================================================
 *                     MOUSE BUTTON
 * =================================================
 */

const MOUSE_BUTTON = 'mouse button';
const mouseButtonValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_MOUSE_MOUSE_BUTTON_VALUE,
    (action) =>
      ((isMouseAction(action) && isClickMouseAction(action)) ||
        (isMouseAction(action) && isHoldReleaseMouseAction(action))) &&
      !isVariableActionValue(action.mouseButton) &&
      isEnterEnumActionValue(action.mouseButton),
    (action) =>
      ((isMouseAction(action) && isClickMouseAction(action)) ||
        (isMouseAction(action) && isHoldReleaseMouseAction(action))) &&
      !isVariableActionValue(action.mouseButton) &&
      isEnterEnumActionValue(action.mouseButton) &&
      isEnumSelected(action.mouseButton.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createNonSelectedEnumError(MOUSE_BUTTON)
  ),
  variable: createValidator(
    Field.AC_MOUSE_MOUSE_BUTTON_VAR,
    (action) =>
      ((isMouseAction(action) && isClickMouseAction(action)) ||
        (isMouseAction(action) && isHoldReleaseMouseAction(action))) &&
      isVariableActionValue(action.mouseButton),
    (action) =>
      ((isMouseAction(action) && isClickMouseAction(action)) ||
        (isMouseAction(action) && isHoldReleaseMouseAction(action))) &&
      isVariableActionValue(action.mouseButton) &&
      isIdSelected(action.mouseButton.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(MOUSE_BUTTON)
  ),
};

/*
 * =================================================
 *                       PAUSE
 * =================================================
 */

const PAUSE = 'pause';
const pauseValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_MOUSE_PAUSE_VAR,
    (action) =>
      ((isMouseAction(action) && isClickMouseAction(action)) ||
        (isMouseAction(action) && isHoldReleaseMouseAction(action))) &&
      isVariableActionValue(action.pause),
    (action) =>
      ((isMouseAction(action) && isClickMouseAction(action)) ||
        (isMouseAction(action) && isHoldReleaseMouseAction(action))) &&
      isVariableActionValue(action.pause) &&
      isIdSelected(action.pause.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(PAUSE)
  ),
};

/*
 * =================================================
 *                       REPEAT
 * =================================================
 */

const REPEAT = 'repeat';
const repeatValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_MOUSE_REPEAT_VAR,
    (action) =>
      isMouseAction(action) &&
      isClickMouseAction(action) &&
      isVariableActionValue(action.repeat),
    (action) =>
      isMouseAction(action) &&
      isClickMouseAction(action) &&
      isVariableActionValue(action.repeat) &&
      isIdSelected(action.repeat.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(REPEAT)
  ),
};

/*
 * =================================================
 *                     DIRECTION
 * =================================================
 */

const DIRECTION = 'direction';
const directionValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_MOUSE_DIRECTION_VALUE,
    (action) =>
      isMouseAction(action) &&
      isHoldReleaseMouseAction(action) &&
      !isVariableActionValue(action.direction) &&
      isEnterEnumActionValue(action.direction),
    (action) =>
      isMouseAction(action) &&
      isHoldReleaseMouseAction(action) &&
      !isVariableActionValue(action.direction) &&
      isEnterEnumActionValue(action.direction) &&
      isEnumSelected(action.direction.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createNonSelectedEnumError(DIRECTION)
  ),
  variable: createValidator(
    Field.AC_MOUSE_DIRECTION_VAR,
    (action) =>
      isMouseAction(action) &&
      isHoldReleaseMouseAction(action) &&
      isVariableActionValue(action.direction),
    (action) =>
      isMouseAction(action) &&
      isHoldReleaseMouseAction(action) &&
      isVariableActionValue(action.direction) &&
      isIdSelected(action.direction.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(DIRECTION)
  ),
};

export const getMouseValidators: () => FieldValidator<Action>[] = () =>
  [
    ...Object.values(moveXValueValidators),
    ...Object.values(moveYValueValidators),
    ...Object.values(mouseButtonValidators),
    ...Object.values(pauseValidators),
    ...Object.values(repeatValidators),
    ...Object.values(directionValidators),
  ].filter(isDefined);
