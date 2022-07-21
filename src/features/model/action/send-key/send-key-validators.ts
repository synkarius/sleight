import {
  alwaysTrue,
  isSelected,
  notEmpty,
} from '../../../../util/common-functions';
import {
  createFilterMap,
  newFilterMapBuilder,
} from '../../../../util/filter-map';
import { createFieldValidator } from '../../../../validation/field-validator';
import { Field } from '../../../../validation/validation-field';
import { Action } from '../action';
import { ActionType } from '../action-types';
import {
  createNonEmptyError,
  createNonSelectedRoleKeyError,
  createNonSelectedVariableError,
  ActionValueValidators,
  toEnteredValueFM,
  toRoleKeyIdFM,
  toVariableIdFM,
  createNoOpValidator,
} from '../action-value/action-value-validation';
import {
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key';
import { SendKeyMode } from './send-key-modes';

/*
 * =================================================
 *               GENERAL SEND KEY
 * =================================================
 */

const toSendKeyFM = createFilterMap(
  (action: Action) => action.type === ActionType.SEND_KEY,
  (action) => action as SendKeyAction
);
export const toSendKeyPressFM = createFilterMap(
  (skAction: SendKeyAction) => skAction.sendKeyMode === SendKeyMode.PRESS,
  (skAction) => skAction as SendKeyPressAction
);
export const toSendKeyHoldReleaseFM = createFilterMap(
  (skAction: SendKeyAction) =>
    skAction.sendKeyMode === SendKeyMode.HOLD_RELEASE,
  (skAction) => skAction as SendKeyHoldReleaseAction
);

/*
 * =================================================
 *                   KEY TO SEND
 * =================================================
 */

const KEY_TO_SEND = 'key to send';
const toKeyToSendFM = createFilterMap(
  alwaysTrue,
  (skAction: SendKeyAction) => skAction.keyToSend
);
const toKeyToSendKeyBuilder =
  newFilterMapBuilder(toSendKeyFM).withFilterMap(toKeyToSendFM);
const toKeyToSendValueFM = toKeyToSendKeyBuilder
  .withFilterMap(toEnteredValueFM)
  .build();
const toKeyToSendVariableIdFM = toKeyToSendKeyBuilder
  .withFilterMap(toVariableIdFM)
  .build();
const toKeyToSendRoleKeyIdFM = toKeyToSendKeyBuilder
  .withFilterMap(toRoleKeyIdFM)
  .build();
export const keyToSendValidators: ActionValueValidators = {
  radioGroupField: Field.AC_KEY_TO_SEND_RADIO,
  value: createFieldValidator(
    Field.AC_KEY_TO_SEND_VALUE,
    toKeyToSendValueFM.filter,
    (action) => notEmpty(toKeyToSendValueFM.map(action)),
    createNonEmptyError(KEY_TO_SEND)
  ),
  variable: createFieldValidator(
    Field.AC_KEY_TO_SEND_VAR,
    toKeyToSendVariableIdFM.filter,
    (action) => isSelected(toKeyToSendVariableIdFM.map(action)),
    createNonSelectedVariableError(KEY_TO_SEND)
  ),
  roleKey: createFieldValidator(
    Field.AC_KEY_TO_SEND_RK,
    toKeyToSendRoleKeyIdFM.filter,
    (action) => isSelected(toKeyToSendRoleKeyIdFM.map(action)),
    createNonSelectedRoleKeyError(KEY_TO_SEND)
  ),
};

/*
 * =================================================
 *                   OUTER PAUSE
 * =================================================
 */

const OUTER_PAUSE = 'outer pause';
const toOuterPauseFM = createFilterMap(
  alwaysTrue,
  (skAction: SendKeyAction) => skAction.outerPause
);
const outerPauseBuilder =
  newFilterMapBuilder(toSendKeyFM).withFilterMap(toOuterPauseFM);
const toOuterPauseVariableIdFM = outerPauseBuilder
  .withFilterMap(toVariableIdFM)
  .build();
const toOuterPauseRoleKeyIdFM = outerPauseBuilder
  .withFilterMap(toRoleKeyIdFM)
  .build();
export const outerPauseValidators: ActionValueValidators = {
  radioGroupField: Field.AC_OUTER_PAUSE_RADIO,
  value: createNoOpValidator(Field.AC_OUTER_PAUSE_VALUE),
  variable: createFieldValidator(
    Field.AC_OUTER_PAUSE_VAR,
    toOuterPauseVariableIdFM.filter,
    (action) => isSelected(toOuterPauseVariableIdFM.map(action)),
    createNonSelectedVariableError(OUTER_PAUSE)
  ),
  roleKey: createFieldValidator(
    Field.AC_OUTER_PAUSE_RK,
    toOuterPauseRoleKeyIdFM.filter,
    (action) => isSelected(toOuterPauseRoleKeyIdFM.map(action)),
    createNonSelectedRoleKeyError(OUTER_PAUSE)
  ),
};

/*
 * =================================================
 *                   INNER PAUSE
 * =================================================
 */

const INNER_PAUSE = 'inner pause';
const toInnerPauseFM = createFilterMap(
  alwaysTrue,
  (skpAction: SendKeyPressAction) => skpAction.innerPause
);
const innerPauseBuilder = newFilterMapBuilder(toSendKeyFM)
  .withFilterMap(toSendKeyPressFM)
  .withFilterMap(toInnerPauseFM);
const toInnerPauseVariableIdFM = innerPauseBuilder
  .withFilterMap(toVariableIdFM)
  .build();
const toInnerPauseRoleKeyIdFM = innerPauseBuilder
  .withFilterMap(toRoleKeyIdFM)
  .build();
export const innerPauseValidators: ActionValueValidators = {
  radioGroupField: Field.AC_INNER_PAUSE_RADIO,
  value: createNoOpValidator(Field.AC_INNER_PAUSE_VALUE),
  variable: createFieldValidator(
    Field.AC_INNER_PAUSE_VAR,
    toInnerPauseVariableIdFM.filter,
    (action) => isSelected(toInnerPauseVariableIdFM.map(action)),
    createNonSelectedVariableError(INNER_PAUSE)
  ),
  roleKey: createFieldValidator(
    Field.AC_INNER_PAUSE_RK,
    toInnerPauseRoleKeyIdFM.filter,
    (action) => isSelected(toInnerPauseRoleKeyIdFM.map(action)),
    createNonSelectedRoleKeyError(INNER_PAUSE)
  ),
};

/*
 * =================================================
 *                      REPEAT
 * =================================================
 */

const REPEAT = 'repeat';
const toRepeatFM = createFilterMap(
  alwaysTrue,
  (skpAction: SendKeyPressAction) => skpAction.repeat
);
const repeatBuilder = newFilterMapBuilder(toSendKeyFM)
  .withFilterMap(toSendKeyPressFM)
  .withFilterMap(toRepeatFM);
const toRepeatVariableIdFM = repeatBuilder
  .withFilterMap(toVariableIdFM)
  .build();
const toRepeatRoleKeyIdFM = repeatBuilder.withFilterMap(toRoleKeyIdFM).build();
export const repeatValidators: ActionValueValidators = {
  radioGroupField: Field.AC_REPEAT_RADIO,
  value: createNoOpValidator(Field.AC_REPEAT_VALUE),
  variable: createFieldValidator(
    Field.AC_REPEAT_VAR,
    toRepeatVariableIdFM.filter,
    (action) => isSelected(toRepeatVariableIdFM.map(action)),
    createNonSelectedVariableError(REPEAT)
  ),
  roleKey: createFieldValidator(
    Field.AC_REPEAT_RK,
    toRepeatRoleKeyIdFM.filter,
    (action) => isSelected(toRepeatRoleKeyIdFM.map(action)),
    createNonSelectedRoleKeyError(REPEAT)
  ),
};

/*
 * =================================================
 *                     DIRECTION
 * =================================================
 */

const DIRECTION = 'direction';
const toDirectionFM = createFilterMap(
  alwaysTrue,
  (skhrAction: SendKeyHoldReleaseAction) => skhrAction.direction
);
const directionBuilder = newFilterMapBuilder(toSendKeyFM)
  .withFilterMap(toSendKeyHoldReleaseFM)
  .withFilterMap(toDirectionFM);
const toDirectionValueFM = directionBuilder
  .withFilterMap(toEnteredValueFM)
  .build();
const toDirectionVariableIdFM = directionBuilder
  .withFilterMap(toVariableIdFM)
  .build();
const toDirectionRoleKeyIdFM = directionBuilder
  .withFilterMap(toRoleKeyIdFM)
  .build();

// TODO: validate this differently so it can only be "up" or "down"
export const directionValidators: ActionValueValidators = {
  radioGroupField: Field.AC_DIRECTION_RADIO,
  value: createFieldValidator(
    Field.AC_DIRECTION_VALUE,
    toDirectionValueFM.filter,
    (action) => notEmpty(toDirectionValueFM.map(action)),
    createNonEmptyError(DIRECTION)
  ),
  variable: createFieldValidator(
    Field.AC_DIRECTION_VAR,
    toDirectionVariableIdFM.filter,
    (action) => isSelected(toDirectionVariableIdFM.map(action)),
    createNonSelectedVariableError(DIRECTION)
  ),
  roleKey: createFieldValidator(
    Field.AC_DIRECTION_RK,
    toDirectionRoleKeyIdFM.filter,
    (action) => isSelected(toDirectionRoleKeyIdFM.map(action)),
    createNonSelectedRoleKeyError(DIRECTION)
  ),
};
