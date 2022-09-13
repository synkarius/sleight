import { Action } from '../../../data/model/action/action';
import {
  isEnterEnumActionValue,
  isVariableActionValue,
} from '../../../data/model/action/action-value/action-value';
import {
  isClickMouseAction,
  isHoldReleaseMouseAction,
  isMouseAction,
} from '../../../data/model/action/mouse/mouse';
import { FieldValidator } from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import { isDefined, isSelected } from '../../common/common-functions';
import {
  ActionValueValidators,
  createNonSelectedEnumError,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';

/*
 * =================================================
 *                     MOUSE BUTTON
 * =================================================
 */

const MOUSE_BUTTON = 'mouse button';
const mouseKeySendValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_MOUSE_MOUSE_BUTTON_VALUE,
    (action) =>
      isMouseAction(action) &&
      isClickMouseAction(action) &&
      !isVariableActionValue(action.mouseKey) &&
      isEnterEnumActionValue(action.mouseKey),
    (action) =>
      isMouseAction(action) &&
      isClickMouseAction(action) &&
      !isVariableActionValue(action.mouseKey) &&
      isEnterEnumActionValue(action.mouseKey) &&
      isSelected(action.mouseKey.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createNonSelectedEnumError(MOUSE_BUTTON)
  ),
  variable: createValidator(
    Field.AC_MOUSE_MOUSE_BUTTON_VAR,
    (action) =>
      isMouseAction(action) &&
      isClickMouseAction(action) &&
      isVariableActionValue(action.mouseKey),
    (action) =>
      isMouseAction(action) &&
      isClickMouseAction(action) &&
      isVariableActionValue(action.mouseKey) &&
      isSelected(action.mouseKey.variableId),
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
      isSelected(action.pause.variableId),
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
      isSelected(action.repeat.variableId),
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
      isSelected(action.direction.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createNonSelectedEnumError(MOUSE_BUTTON)
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
      isSelected(action.direction.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(DIRECTION)
  ),
};

export const getMouseValidators: () => FieldValidator<Action>[] = () =>
  [
    ...Object.values(mouseKeySendValidators),
    ...Object.values(pauseValidators),
    ...Object.values(repeatValidators),
    ...Object.values(directionValidators),
  ].filter(isDefined);
