import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { CurrentActionNotFoundError } from '../../../error/CurrentActionNotFoundError';
import { UnhandledActionTypeError } from '../../../error/UnhandledActionTypeError';
import { UnhandledActionValueOperationError } from '../../../error/UnhandledActionValueOperationError';
import { UnhandledSendKeyFieldError } from '../../../error/UnhandledSendKeyFieldError';
import { UnhandledSendKeyModeError } from '../../../error/UnhandledSendKeyModeError';
import { UnhandledSendKeyModifierTypeError } from '../../../error/UnhandledSendKeyModifierTypeError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import {
  removeError,
  validate,
  ValidationError,
} from '../../../validation/validator';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import {
  Action,
  ChangeActionTypePayload,
  ChangeSendKeyModePayload,
} from './action';
import { ActionType } from './action-types';
import {
  directionNotEmpty,
  directionRoleKey,
  directionVariable,
  IdValued,
  innerPauseRoleKey,
  innerPauseVariable,
  keyToSendNotEmpty,
  keyToSendRoleKey,
  keyToSendVariable,
  outerPauseRoleKey,
  outerPauseVariable,
  repeatRoleKey,
  repeatVariable,
  TextValued,
} from './action-validation';
import {
  ChangeActionValuePayload,
  ChoiceValue,
  RangeValue,
  TextValue,
} from './action-value/action-value';
import { ActionValueOperation } from './action-value/action-value-operation';
import { copyIntoPauseAction } from './pause/pause';
import {
  copyIntoSendKeyHoldReleaseAction,
  copyIntoSendKeyPressAction,
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key/send-key';
import { SendKeyMode } from './send-key/send-key-modes';
import { SendKeyModifiers } from './send-key/send-key-modifiers';
import { SendKeyField } from './send-key/send-key-payloads';

export type ActionsState = {
  saved: ReduxFriendlyStringMap<Action>;
  editing: Action | null;
  validationErrors: ValidationError[];
};

const initialState: ActionsState = {
  saved: {},
  editing: null,
  validationErrors: [],
};

const getActionValue = (
  state: Draft<ActionsState>,
  field: SendKeyField
): IdValued => {
  if (state.editing) {
    switch (field) {
      case SendKeyField.KEY_TO_SEND:
        return (state.editing as SendKeyPressAction).sendKey;
      case SendKeyField.OUTER_PAUSE:
        return (state.editing as SendKeyPressAction).outerPause;
      case SendKeyField.INNER_PAUSE:
        return (state.editing as SendKeyPressAction).innerPause;
      case SendKeyField.REPEAT:
        return (state.editing as SendKeyPressAction).repeat;
      case SendKeyField.DIRECTION:
        return (state.editing as SendKeyHoldReleaseAction).direction;
      default:
        throw new UnhandledSendKeyFieldError(field);
    }
  }
  throw new CurrentActionNotFoundError();
};

const performOperation = (
  actionValue: IdValued,
  eventTargetValue: string,
  operation: ActionValueOperation
) => {
  switch (operation) {
    case ActionValueOperation.CHANGE_TYPE:
      actionValue.actionValueType = eventTargetValue;
      break;
    case ActionValueOperation.CHANGE_ENTERED_VALUE:
      // TODO: do this check better
      if (typeof actionValue.value === 'number') {
        const rangeValue = actionValue as RangeValue;
        rangeValue.value = +eventTargetValue;
      } else {
        const textBasedValue = actionValue as TextValued;
        textBasedValue.value = eventTargetValue;
      }
      break;
    case ActionValueOperation.CHANGE_VARIABLE_ID:
      actionValue.variableId = eventTargetValue;
      break;
    case ActionValueOperation.CHANGE_ROLE_KEY_ID:
      actionValue.roleKeyId = eventTargetValue;
      break;
    default:
      throw new UnhandledActionValueOperationError(operation);
  }
};

const updateActionValue = (
  state: Draft<ActionsState>,
  eventTargetValue: string,
  field: SendKeyField,
  operation: ActionValueOperation
) => {
  const actionValue = getActionValue(state, field);
  performOperation(actionValue, eventTargetValue, operation);
};

const clearTextValued = (actionValue: TextValued) => {
  actionValue.value = '';
  actionValue.variableId = SELECT_DEFAULT_VALUE;
  actionValue.roleKeyId = SELECT_DEFAULT_VALUE;
};

const clearNumericValued = (actionValue: RangeValue) => {
  actionValue.value = 0;
  actionValue.variableId = SELECT_DEFAULT_VALUE;
  actionValue.roleKeyId = SELECT_DEFAULT_VALUE;
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    createNewEditingAction: (state, action: PayloadAction<Action>) => {
      state.editing = action.payload;
    },
    selectAction: (state, action: PayloadAction<string>) => {
      state.editing = state.saved[action.payload];
    },
    saveAndClearEditingAction: (state) => {
      if (state.editing && state.validationErrors.length === 0) {
        state.saved[state.editing.id] = state.editing;
        state.editing = null;
      }
    },
    clearEditingAction: (state) => {
      state.editing = null;
    },
    changeEditingActionName: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.name = action.payload;
      }
    },
    changeEditingActionRoleKey: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.roleKeyId = action.payload;
      }
    },
    changeEditingActionType: (
      state,
      action: PayloadAction<ChangeActionTypePayload>
    ) => {
      // casting here to non-null b/c should not ever be null while editing
      const editing = state.editing as Action;
      switch (action.payload.actionType) {
        case ActionType.PAUSE:
          state.editing = copyIntoPauseAction(editing);
          break;
        case ActionType.SEND_KEY:
          state.editing = copyIntoSendKeyPressAction(editing);
          break;
        default:
          throw new UnhandledActionTypeError(action.payload.actionType);
      }
    },
    changeEditingSendKeyMode: (
      state,
      action: PayloadAction<ChangeSendKeyModePayload>
    ) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyAction;
        switch (action.payload.sendKeyMode) {
          case SendKeyMode.PRESS:
            state.editing = copyIntoSendKeyPressAction(sendKeyAction);
            break;
          case SendKeyMode.HOLD_RELEASE:
            state.editing = copyIntoSendKeyHoldReleaseAction(sendKeyAction);
            break;
          default:
            throw new UnhandledSendKeyModeError(action.payload.sendKeyMode);
        }
      }
    },
    //
    toggleModifier: (state, action: PayloadAction<SendKeyModifiers>) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyAction;
        switch (action.payload) {
          case SendKeyModifiers.CONTROL:
            sendKeyAction.modifiers.control = !sendKeyAction.modifiers.control;
            break;
          case SendKeyModifiers.ALT:
            sendKeyAction.modifiers.alt = !sendKeyAction.modifiers.alt;
            break;
          case SendKeyModifiers.SHIFT:
            sendKeyAction.modifiers.shift = !sendKeyAction.modifiers.shift;
            break;
          case SendKeyModifiers.WINDOWS:
            sendKeyAction.modifiers.windows = !sendKeyAction.modifiers.windows;
            break;
          default:
            throw new UnhandledSendKeyModifierTypeError(action.payload);
        }
      }
    },
    changeSendKey: (
      state,
      action: PayloadAction<ChangeActionValuePayload<SendKeyField>>
    ) => {
      const payload = action.payload;
      updateActionValue(
        state,
        payload.eventTargetValue,
        payload.field,
        payload.operation
      );
    },
    // key to send
    validateKeyToSend: (state) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyAction;
        [keyToSendNotEmpty, keyToSendVariable, keyToSendRoleKey].forEach(
          (validator) =>
            validate(sendKeyAction.sendKey, validator, state.validationErrors)
        );
      }
    },
    resetKeyToSend: (state) => {
      if (state.editing) {
        clearTextValued((state.editing as SendKeyAction).sendKey);
        [keyToSendNotEmpty, keyToSendVariable, keyToSendRoleKey]
          .map((v) => v.error)
          .forEach((error) => removeError(state.validationErrors, error));
      }
    },
    // outer pause
    validateOuterPause: (state) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyAction;
        [outerPauseVariable, outerPauseRoleKey].forEach((validator) =>
          validate(sendKeyAction.outerPause, validator, state.validationErrors)
        );
      }
    },
    resetOuterPause: (state) => {
      if (state.editing) {
        clearNumericValued((state.editing as SendKeyAction).outerPause);
        [outerPauseVariable, outerPauseRoleKey]
          .map((v) => v.error)
          .forEach((error) => removeError(state.validationErrors, error));
      }
    },
    // inner pause
    validateInnerPause: (state) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyPressAction;
        [innerPauseVariable, innerPauseRoleKey].forEach((validator) =>
          validate(sendKeyAction.innerPause, validator, state.validationErrors)
        );
      }
    },
    resetInnerPause: (state) => {
      if (state.editing) {
        clearNumericValued((state.editing as SendKeyPressAction).innerPause);
        [innerPauseVariable, innerPauseRoleKey]
          .map((v) => v.error)
          .forEach((error) => removeError(state.validationErrors, error));
      }
    },
    // repeat
    validateRepeat: (state) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyPressAction;
        [repeatVariable, repeatRoleKey].forEach((validator) =>
          validate(sendKeyAction.repeat, validator, state.validationErrors)
        );
      }
    },
    resetRepeat: (state) => {
      if (state.editing) {
        clearNumericValued((state.editing as SendKeyPressAction).repeat);
        [repeatVariable, repeatRoleKey]
          .map((v) => v.error)
          .forEach((error) => removeError(state.validationErrors, error));
      }
    },
    // direction
    resetDirection: (state) => {
      if (state.editing) {
        clearTextValued((state.editing as SendKeyHoldReleaseAction).direction);
        [directionNotEmpty, directionVariable, directionRoleKey]
          .map((v) => v.error)
          .forEach((error) => removeError(state.validationErrors, error));
      }
    },
    validateDirection: (state) => {
      if (state.editing) {
        const sendKeyAction = state.editing as SendKeyHoldReleaseAction;
        [directionNotEmpty, directionVariable, directionRoleKey].forEach(
          (validator) =>
            validate(sendKeyAction.direction, validator, state.validationErrors)
        );
      }
    },
  },
});

export const {
  createNewEditingAction,
  selectAction,
  clearEditingAction,
  changeEditingActionName,
  changeEditingActionRoleKey,
  changeEditingActionType,
  saveAndClearEditingAction,
  // send-key
  changeSendKey,
  changeEditingSendKeyMode,
  toggleModifier,
  validateKeyToSend,
  resetKeyToSend,
  validateOuterPause,
  resetOuterPause,
  validateInnerPause,
  resetInnerPause,
  validateRepeat,
  resetRepeat,
  validateDirection,
  resetDirection,
} = actionsSlice.actions;
export const actionReducer = actionsSlice.reducer;
