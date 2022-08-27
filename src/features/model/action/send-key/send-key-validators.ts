import { isSelected } from '../../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
  ValidatorType,
} from '../../../../validation/field-validator';
import { ValidationErrorCode } from '../../../../validation/validation-error-code';
import { Field } from '../../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../../validation/validation-result';
import { VariableType } from '../../variable/variable-types';
import { Action } from '../action';
import {
  isEnterEnumActionValue,
  isRoleKeyActionValue,
  isVariableActionValue,
} from '../action-value/action-value';
import {
  ActionValueValidators,
  createNonSelectedEnumError,
  createNonSelectedRoleKeyError,
  createNonSelectedVariableError,
  getRoleKeyExistsError,
  VAR_FOR_RK_NOT_EXISTS,
} from '../action-value/action-value-validation';
import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
  isSendKeyPressAction,
} from './send-key';

const KTS_RK = Field.AC_KEY_TO_SEND_RK;
const OP_RK = Field.AC_OUTER_PAUSE_RK;
const IP_RK = Field.AC_INNER_PAUSE_RK;
const RPT_RK = Field.AC_REPEAT_RK;
const DIR_RK = Field.AC_DIRECTION_RK;

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
  roleKeySelected: createValidator(
    KTS_RK,
    (action) =>
      isSendKeyAction(action) && isRoleKeyActionValue(action.keyToSend),
    (action) =>
      isSendKeyAction(action) &&
      isRoleKeyActionValue(action.keyToSend) &&
      isSelected(action.keyToSend.roleKeyId),
    ValidationErrorCode.AC_AV_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(KEY_TO_SEND)
  ),
  roleKeyedElementExists: {
    validatorType: ValidatorType.FIELD,
    field: KTS_RK,
    isApplicable: (action) =>
      isSendKeyAction(action) && isRoleKeyActionValue(action.keyToSend),
    validate: (action, data) => {
      if (isSendKeyAction(action) && isRoleKeyActionValue(action.keyToSend)) {
        const errorResult = getRoleKeyExistsError(
          KTS_RK,
          VariableType.Enum.CHOICE,
          action.keyToSend,
          data.variables
        );
        if (errorResult) {
          return errorResult;
        }
      }
      return validResult(KTS_RK);
    },
  },
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
  roleKeySelected: createValidator(
    OP_RK,
    (action) =>
      isSendKeyAction(action) && isRoleKeyActionValue(action.outerPause),
    (action) =>
      isSendKeyAction(action) &&
      isRoleKeyActionValue(action.outerPause) &&
      isSelected(action.outerPause.roleKeyId),
    ValidationErrorCode.AC_AV_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(OUTER_PAUSE)
  ),
  roleKeyedElementExists: {
    validatorType: ValidatorType.FIELD,
    field: OP_RK,
    isApplicable: (action) =>
      isSendKeyAction(action) && isRoleKeyActionValue(action.outerPause),
    validate: (action, data) => {
      if (isSendKeyAction(action) && isRoleKeyActionValue(action.outerPause)) {
        const errorResult = getRoleKeyExistsError(
          OP_RK,
          VariableType.Enum.RANGE,
          action.outerPause,
          data.variables
        );
        if (errorResult) {
          return errorResult;
        }
      }
      return validResult(OP_RK);
    },
  },
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
  roleKeySelected: createValidator(
    IP_RK,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.innerPause),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.innerPause) &&
      isSelected(action.innerPause.roleKeyId),
    ValidationErrorCode.AC_AV_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(INNER_PAUSE)
  ),
  roleKeyedElementExists: {
    validatorType: ValidatorType.FIELD,
    field: IP_RK,
    isApplicable: (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.innerPause),
    validate: (action, data) => {
      if (
        isSendKeyAction(action) &&
        isSendKeyPressAction(action) &&
        isRoleKeyActionValue(action.innerPause)
      ) {
        const errorResult = getRoleKeyExistsError(
          IP_RK,
          VariableType.Enum.RANGE,
          action.innerPause,
          data.variables
        );
        if (errorResult) {
          return errorResult;
        }
      }
      return validResult(IP_RK);
    },
  },
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
  roleKeySelected: createValidator(
    RPT_RK,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.repeat),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.repeat) &&
      isSelected(action.repeat.roleKeyId),
    ValidationErrorCode.AC_AV_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(REPEAT)
  ),
  roleKeyedElementExists: {
    validatorType: ValidatorType.FIELD,
    field: RPT_RK,
    isApplicable: (action) =>
      isSendKeyAction(action) &&
      isSendKeyPressAction(action) &&
      isRoleKeyActionValue(action.repeat),
    validate: (action, data) => {
      if (
        isSendKeyAction(action) &&
        isSendKeyPressAction(action) &&
        isRoleKeyActionValue(action.repeat)
      ) {
        const errorResult = getRoleKeyExistsError(
          RPT_RK,
          VariableType.Enum.RANGE,
          action.repeat,
          data.variables
        );
        if (errorResult) {
          return errorResult;
        }
      }
      return validResult(RPT_RK);
    },
  },
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
  roleKeySelected: createValidator(
    DIR_RK,
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isRoleKeyActionValue(action.direction),
    (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isRoleKeyActionValue(action.direction) &&
      isSelected(action.direction.roleKeyId),
    ValidationErrorCode.AC_AV_RK_NOT_SELECTED,
    createNonSelectedRoleKeyError(DIRECTION)
  ),
  roleKeyedElementExists: {
    validatorType: ValidatorType.FIELD,
    field: DIR_RK,
    isApplicable: (action) =>
      isSendKeyAction(action) &&
      isSendKeyHoldReleaseAction(action) &&
      isRoleKeyActionValue(action.direction),
    validate: (action, data) => {
      if (
        isSendKeyAction(action) &&
        isSendKeyHoldReleaseAction(action) &&
        isRoleKeyActionValue(action.direction)
      ) {
        const errorResult = getRoleKeyExistsError(
          DIR_RK,
          VariableType.Enum.CHOICE,
          action.direction,
          data.variables
        );
        if (errorResult) {
          return errorResult;
        }
      }
      return validResult(DIR_RK);
    },
  },
};

export const getSendKeyValidators: () => FieldValidator<Action>[] = () => [
  keyToSendValidators.value!,
  keyToSendValidators.variable,
  keyToSendValidators.roleKeySelected,
  keyToSendValidators.roleKeyedElementExists,
  outerPauseValidators.variable,
  outerPauseValidators.roleKeySelected,
  outerPauseValidators.roleKeyedElementExists,
  innerPauseValidators.variable,
  innerPauseValidators.roleKeySelected,
  innerPauseValidators.roleKeyedElementExists,
  repeatValidators.variable,
  repeatValidators.roleKeySelected,
  repeatValidators.roleKeyedElementExists,
  directionValidators.value!,
  directionValidators.variable,
  directionValidators.roleKeySelected,
  directionValidators.roleKeyedElementExists,
];
