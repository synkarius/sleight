import { isDefined, isSelected } from '../../common/common-functions';
import { FieldValidator } from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import { Action } from '../../../data/model/action/action';
import {
  isEnterEnumActionValue,
  isVariableActionValue,
} from '../../../data/model/action/action-value/action-value';
import {
  ActionValueValidators,
  createNonSelectedEnumError,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';
import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
  isSendKeyPressAction,
} from '../../../data/model/action/send-key/send-key';

/*
 * =================================================
 *                   KEY TO SEND
 * =================================================
 */

const KEY_TO_SEND = 'key to send';
const keyToSendValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_KEY_TO_SEND_VALUE,
    (action) =>
      isSendKeyAction(action) &&
      !isVariableActionValue(action.keyToSend) &&
      isEnterEnumActionValue(action.keyToSend),
    (action) =>
      isSendKeyAction(action) &&
      !isVariableActionValue(action.keyToSend) &&
      isEnterEnumActionValue(action.keyToSend) &&
      isSelected(action.keyToSend.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createNonSelectedEnumError(KEY_TO_SEND)
  ),
  variable: createValidator(
    Field.AC_KEY_TO_SEND_VAR,
    (action) =>
      isSendKeyAction(action) && isVariableActionValue(action.keyToSend),
    (action) =>
      isSendKeyAction(action) &&
      isVariableActionValue(action.keyToSend) &&
      isSelected(action.keyToSend.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(KEY_TO_SEND)
  ),
};

/*
 * =================================================
 *                   OUTER PAUSE
 * =================================================
 */

const OUTER_PAUSE = 'outer pause';
const outerPauseValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_OUTER_PAUSE_VAR,
    (action) =>
      isSendKeyAction(action) && isVariableActionValue(action.outerPause),
    (action) =>
      isSendKeyAction(action) &&
      isVariableActionValue(action.outerPause) &&
      isSelected(action.outerPause.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(OUTER_PAUSE)
  ),
};

/*
 * =================================================
 *                   INNER PAUSE
 * =================================================
 */

const INNER_PAUSE = 'inner pause';
const innerPauseValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_INNER_PAUSE_VAR,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isVariableActionValue(action.innerPause),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isVariableActionValue(action.innerPause) &&
      isSelected(action.innerPause.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(INNER_PAUSE)
  ),
};

/*
 * =================================================
 *                      REPEAT
 * =================================================
 */

const REPEAT = 'repeat';
const repeatValidators: ActionValueValidators = {
  variable: createValidator(
    Field.AC_REPEAT_VAR,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isVariableActionValue(action.repeat),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
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
    Field.AC_DIRECTION_VALUE,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      !isVariableActionValue(action.direction) &&
      isEnterEnumActionValue(action.direction),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      !isVariableActionValue(action.direction) &&
      isEnterEnumActionValue(action.direction) &&
      isSelected(action.direction.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createNonSelectedEnumError(DIRECTION)
  ),
  variable: createValidator(
    Field.AC_DIRECTION_VAR,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isVariableActionValue(action.direction),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isVariableActionValue(action.direction) &&
      isSelected(action.direction.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(DIRECTION)
  ),
};

export const getSendKeyValidators: () => FieldValidator<Action>[] = () =>
  [
    ...Object.values(keyToSendValidators),
    ...Object.values(outerPauseValidators),
    ...Object.values(innerPauseValidators),
    ...Object.values(repeatValidators),
    ...Object.values(directionValidators),
  ].filter(isDefined);
