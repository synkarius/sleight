import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { CurrentActionNotFoundError } from '../../../error/CurrentActionNotFoundError';
import { UnhandledActionTypeError } from '../../../error/UnhandledActionTypeError';
import { UnhandledActionValueOperationError } from '../../../error/UnhandledActionValueOperationError';
import { UnhandledSendKeyFieldError } from '../../../error/UnhandledSendKeyFieldError';
import { UnhandledSendKeyModeError } from '../../../error/UnhandledSendKeyModeError';
import { UnhandledSendKeyModifierTypeError } from '../../../error/UnhandledSendKeyModifierTypeError';
import { ReduxFriendlyStringMap } from '../../../util/structures';
import {
  Action,
  ChangeActionTypePayload,
  ChangeSendKeyModePayload,
} from './action';
import { ActionType } from './action-types';
import {
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
  SendKeyPressAction,
} from './send-key/send-key';
import { SendKeyMode } from './send-key/send-key-modes';
import { SendKeyModifiers } from './send-key/send-key-modifiers';
import { SendKeyField } from './send-key/send-key-payloads';

export type ActionsState = {
  saved: ReduxFriendlyStringMap<Action>;
  editing: Action | null;
};

const initialState: ActionsState = {
  saved: {},
  editing: null,
};

type SomeTextValuedActionValue = TextValue | ChoiceValue;
type SomeActionValue = SomeTextValuedActionValue | RangeValue;

const getActionValue = (
  state: Draft<ActionsState>,
  field: SendKeyField
): SomeActionValue => {
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
      default:
        throw new UnhandledSendKeyFieldError(field);
    }
  }
  throw new CurrentActionNotFoundError();
};

const performOperation = (
  actionValue: SomeActionValue,
  action: PayloadAction<string>,
  operation: ActionValueOperation
) => {
  const eventTargetValue = action.payload;
  switch (operation) {
    case ActionValueOperation.CHANGE_TYPE:
      actionValue.actionValueType = eventTargetValue;
      break;
    case ActionValueOperation.CHANGE_VALUE_STRING:
      const textBasedValue = actionValue as SomeTextValuedActionValue;
      textBasedValue.value = eventTargetValue;
      break;
    case ActionValueOperation.CHANGE_VALUE_NUMBER:
      const rangeValue = actionValue as RangeValue;
      rangeValue.value = +eventTargetValue;
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
  action: PayloadAction<string>,
  field: SendKeyField,
  operation: ActionValueOperation
) => {
  const actionValue = getActionValue(state, field);
  performOperation(actionValue, action, operation);
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
    saveEditingAction: (state) => {
      if (state.editing) {
        // TODO: validation
        state.saved[state.editing.id] = state.editing;
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
    // key to send
    changeKeyToSendActionValueType: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.KEY_TO_SEND,
        ActionValueOperation.CHANGE_TYPE
      );
    },
    changeKeyToSendValue: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.KEY_TO_SEND,
        ActionValueOperation.CHANGE_VALUE_STRING
      );
    },
    changeKeyToSendVariableId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.KEY_TO_SEND,
        ActionValueOperation.CHANGE_VARIABLE_ID
      );
    },
    changeKeyToSendRoleKeyId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.KEY_TO_SEND,
        ActionValueOperation.CHANGE_ROLE_KEY_ID
      );
    },
    // outer pause
    changeOuterPauseActionValueType: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.OUTER_PAUSE,
        ActionValueOperation.CHANGE_TYPE
      );
    },
    changeOuterPauseValue: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.OUTER_PAUSE,
        ActionValueOperation.CHANGE_VALUE_NUMBER
      );
    },
    changeOuterPauseVariableId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.OUTER_PAUSE,
        ActionValueOperation.CHANGE_VARIABLE_ID
      );
    },
    changeOuterPauseRoleKeyId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.OUTER_PAUSE,
        ActionValueOperation.CHANGE_ROLE_KEY_ID
      );
    },
    // inner pause
    changeInnerPauseActionValueType: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.INNER_PAUSE,
        ActionValueOperation.CHANGE_TYPE
      );
    },
    changeInnerPauseValue: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.INNER_PAUSE,
        ActionValueOperation.CHANGE_VALUE_NUMBER
      );
    },
    changeInnerPauseVariableId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.INNER_PAUSE,
        ActionValueOperation.CHANGE_VARIABLE_ID
      );
    },
    changeInnerPauseRoleKeyId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.INNER_PAUSE,
        ActionValueOperation.CHANGE_ROLE_KEY_ID
      );
    },
    // repeat
    changeRepeatActionValueType: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.REPEAT,
        ActionValueOperation.CHANGE_TYPE
      );
    },
    changeRepeatValue: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.REPEAT,
        ActionValueOperation.CHANGE_VALUE_NUMBER
      );
    },
    changeRepeatVariableId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.REPEAT,
        ActionValueOperation.CHANGE_VARIABLE_ID
      );
    },
    changeRepeatRoleKeyId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.REPEAT,
        ActionValueOperation.CHANGE_ROLE_KEY_ID
      );
    },
    // direction
    changeDirectionActionValueType: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.DIRECTION,
        ActionValueOperation.CHANGE_TYPE
      );
    },
    changeDirectionValue: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.DIRECTION,
        ActionValueOperation.CHANGE_VALUE_STRING
      );
    },
    changeDirectionVariableId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.DIRECTION,
        ActionValueOperation.CHANGE_VARIABLE_ID
      );
    },
    changeDirectionRoleKeyId: (state, action: PayloadAction<string>) => {
      updateActionValue(
        state,
        action,
        SendKeyField.DIRECTION,
        ActionValueOperation.CHANGE_ROLE_KEY_ID
      );
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
  saveEditingAction,
  // send-key
  changeEditingSendKeyMode,
  // send-key key to send
  changeKeyToSendActionValueType,
  changeKeyToSendValue,
  changeKeyToSendVariableId,
  changeKeyToSendRoleKeyId,
  // send-key modifiers
  toggleModifier,
  // send-key outer pause
  changeOuterPauseActionValueType,
  changeOuterPauseValue,
  changeOuterPauseVariableId,
  changeOuterPauseRoleKeyId,
  // send-key inner pause
  changeInnerPauseActionValueType,
  changeInnerPauseValue,
  changeInnerPauseVariableId,
  changeInnerPauseRoleKeyId,
  // send-key repeat
  changeRepeatActionValueType,
  changeRepeatValue,
  changeRepeatVariableId,
  changeRepeatRoleKeyId,
  // send-key direction
  changeDirectionActionValueType,
  changeDirectionValue,
  changeDirectionVariableId,
  changeDirectionRoleKeyId,
} = actionsSlice.actions;
export const actionReducer = actionsSlice.reducer;
