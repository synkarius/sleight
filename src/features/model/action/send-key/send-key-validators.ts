import {
  alwaysFalse,
  isSelected,
  notEmpty,
} from '../../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
} from '../../../../validation/field-validator';
import { ValidationErrorCode } from '../../../../validation/validation-error-code';
import { Field } from '../../../../validation/validation-field';
import { validResult } from '../../../../validation/validation-result';
import { Action } from '../action';
import {
  isEnterEnumActionValue,
  isEnterValueActionValue,
  isRoleKeyActionValue,
  isVariableActionValue,
} from '../action-value/action-value';
import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
  isSendKeyPressAction,
} from './send-key';

interface ActionValueValidators {
  readonly value: FieldValidator<Action>;
  readonly variable: FieldValidator<Action>;
  readonly roleKey: FieldValidator<Action>;
}

const createNoOpValidator = (field: Field): FieldValidator<Action> => ({
  field,
  isApplicable: alwaysFalse,
  validate: (_) => validResult(field),
});

const createNonEmptyError = (fieldName: string) =>
  fieldName + " : can't be empty";
const createNonSelectedEnumError = (fieldName: string) =>
  fieldName + ' : value must be selected';
const createNonSelectedVariableError = (fieldName: string) =>
  fieldName + ' : variable must be selected';
const createNonSelectedRoleKeyError = (fieldName: string) =>
  fieldName + ' : role key must be selected';

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
      !isRoleKeyActionValue(action.keyToSend) &&
      isEnterEnumActionValue(action.keyToSend),
    (action) =>
      isSendKeyAction(action) &&
      !isVariableActionValue(action.keyToSend) &&
      !isRoleKeyActionValue(action.keyToSend) &&
      isEnterEnumActionValue(action.keyToSend) &&
      isSelected(action.keyToSend.value),
    ValidationErrorCode.AC_KTS_EMPTY,
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
    ValidationErrorCode.AC_KTS_VAR_NOT_SELECTED,
    createNonSelectedVariableError(KEY_TO_SEND)
  ),
  roleKey: createValidator(
    Field.AC_KEY_TO_SEND_RK,
    (action) =>
      isSendKeyAction(action) && isRoleKeyActionValue(action.keyToSend),
    (action) =>
      isSendKeyAction(action) &&
      isRoleKeyActionValue(action.keyToSend) &&
      isSelected(action.keyToSend.roleKeyId),
    ValidationErrorCode.AC_KTS_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(KEY_TO_SEND)
  ),
};

/*
 * =================================================
 *                   OUTER PAUSE
 * =================================================
 */

const OUTER_PAUSE = 'outer pause';
const outerPauseValidators: ActionValueValidators = {
  value: createNoOpValidator(Field.AC_OUTER_PAUSE_VALUE),
  variable: createValidator(
    Field.AC_OUTER_PAUSE_VAR,
    (action) =>
      isSendKeyAction(action) && isVariableActionValue(action.outerPause),
    (action) =>
      isSendKeyAction(action) &&
      isVariableActionValue(action.outerPause) &&
      isSelected(action.outerPause.variableId),
    ValidationErrorCode.AC_OP_VAR_NOT_SELECTED,
    createNonSelectedVariableError(OUTER_PAUSE)
  ),
  roleKey: createValidator(
    Field.AC_OUTER_PAUSE_RK,
    (action) =>
      isSendKeyAction(action) && isRoleKeyActionValue(action.outerPause),
    (action) =>
      isSendKeyAction(action) &&
      isRoleKeyActionValue(action.outerPause) &&
      isSelected(action.outerPause.roleKeyId),
    ValidationErrorCode.AC_OP_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(OUTER_PAUSE)
  ),
};

/*
 * =================================================
 *                   INNER PAUSE
 * =================================================
 */

const INNER_PAUSE = 'inner pause';
const innerPauseValidators: ActionValueValidators = {
  value: createNoOpValidator(Field.AC_INNER_PAUSE_VALUE),
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
    ValidationErrorCode.AC_IP_VAR_NOT_SELECTED,
    createNonSelectedVariableError(INNER_PAUSE)
  ),
  roleKey: createValidator(
    Field.AC_INNER_PAUSE_RK,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.innerPause),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.innerPause) &&
      isSelected(action.innerPause.roleKeyId),
    ValidationErrorCode.AC_IP_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(INNER_PAUSE)
  ),
};

/*
 * =================================================
 *                      REPEAT
 * =================================================
 */

const REPEAT = 'repeat';
const repeatValidators: ActionValueValidators = {
  value: createNoOpValidator(Field.AC_REPEAT_VALUE),
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
    ValidationErrorCode.AC_RPT_VAR_NOT_SELECTED,
    createNonSelectedVariableError(REPEAT)
  ),
  roleKey: createValidator(
    Field.AC_REPEAT_RK,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.repeat),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.repeat) &&
      isSelected(action.repeat.roleKeyId),
    ValidationErrorCode.AC_RPT_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(REPEAT)
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
      !isRoleKeyActionValue(action.direction) &&
      isEnterEnumActionValue(action.direction),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      !isVariableActionValue(action.direction) &&
      !isRoleKeyActionValue(action.direction) &&
      isEnterEnumActionValue(action.direction) &&
      isSelected(action.direction.value),
    ValidationErrorCode.AC_DIR_EMPTY,
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
    ValidationErrorCode.AC_DIR_VAR_NOT_SELECTED,
    createNonSelectedVariableError(DIRECTION)
  ),
  roleKey: createValidator(
    Field.AC_DIRECTION_RK,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isRoleKeyActionValue(action.direction),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isRoleKeyActionValue(action.direction) &&
      isSelected(action.direction.roleKeyId),
    ValidationErrorCode.AC_DIR_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(DIRECTION)
  ),
};

export const sendKeyValidators = [
  keyToSendValidators.value,
  keyToSendValidators.variable,
  keyToSendValidators.roleKey,
  outerPauseValidators.variable,
  outerPauseValidators.roleKey,
  innerPauseValidators.variable,
  innerPauseValidators.roleKey,
  repeatValidators.variable,
  repeatValidators.roleKey,
  directionValidators.value,
  directionValidators.variable,
  directionValidators.roleKey,
];
