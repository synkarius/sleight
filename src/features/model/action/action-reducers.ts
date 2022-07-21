import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnhandledActionEditingEventTypeError } from '../../../error/UnhandledActionEditingEventTypeError';
import { UnhandledActionTypeError } from '../../../error/UnhandledActionTypeError';
import { UnhandledActionValueOperationError } from '../../../error/UnhandledActionValueOperationError';
import { UnhandledSendKeyFieldError } from '../../../error/UnhandledSendKeyFieldError';
import { UnhandledSendKeyModeError } from '../../../error/UnhandledSendKeyModeError';
import { UnhandledSendKeyModifierTypeError } from '../../../error/UnhandledSendKeyModifierTypeError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { Field } from '../../../validation/validation-field';
import { VariableType } from '../variable/variable-types';
import { Action } from './action';
import {
  ActionReducerAction,
  ActionReducerActionType,
  ActionReducerModifiersPayloadAction,
  ActionReducerStringPayloadAction,
  ActionReducerChangePayloadAction,
} from './action-editing-context';
import { ActionType } from './action-types';
import { RangeValue } from './action-value/action-value';
import { IdValued, TextValued } from './action-value/action-value-validation';
import { copyIntoPauseAction } from './pause/pause';
import {
  copyIntoSendKeyHoldReleaseAction,
  copyIntoSendKeyPressAction,
  Modifiers,
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key/send-key';
import { SendKeyMode } from './send-key/send-key-modes';
import { SendKeyModifiers } from './send-key/send-key-modifiers';

export type ActionsState = {
  saved: ReduxFriendlyStringMap<Action>;
  editingId: string | undefined;
};

const initialState: ActionsState = {
  saved: {},
  editingId: undefined,
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    selectAction: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveAction: (state, action: PayloadAction<Action>) => {
      state.saved[action.payload.id] = action.payload;
    },
  },
});

export const { selectAction, saveAction } = actionsSlice.actions;
export const actionReduxReducer = actionsSlice.reducer;

const toggleModifier = (
  state: Action,
  action: ActionReducerAction
): SendKeyAction => {
  const modifiersAction = action as ActionReducerModifiersPayloadAction;
  const getNewModifiers = (
    oldModifiers: Modifiers,
    toggle: SendKeyModifiers
  ): Modifiers => {
    switch (toggle) {
      case SendKeyModifiers.CONTROL:
        return {
          ...oldModifiers,
          control: !oldModifiers.control,
        };
      case SendKeyModifiers.ALT:
        return {
          ...oldModifiers,
          alt: !oldModifiers.alt,
        };
      case SendKeyModifiers.SHIFT:
        return {
          ...oldModifiers,
          shift: !oldModifiers.shift,
        };
      case SendKeyModifiers.WINDOWS:
        return {
          ...oldModifiers,
          windows: !oldModifiers.windows,
        };
      default:
        throw new UnhandledSendKeyModifierTypeError(modifiersAction.payload);
    }
  };
  const sendKeyAction = state as SendKeyAction;
  return {
    ...sendKeyAction,
    modifiers: getNewModifiers(
      sendKeyAction.modifiers,
      modifiersAction.payload
    ),
  };
};

const changeEditingSendKeyMode = (
  state: Action,
  action: ActionReducerAction
): Action => {
  const stringAction = action as ActionReducerStringPayloadAction;
  switch (stringAction.payload) {
    case SendKeyMode.PRESS:
      return copyIntoSendKeyPressAction(state);
    case SendKeyMode.HOLD_RELEASE:
      return copyIntoSendKeyHoldReleaseAction(state);
    default:
      throw new UnhandledSendKeyModeError(stringAction.payload);
  }
};

const changeEditingActionType = (
  state: Action,
  action: ActionReducerAction
): Action => {
  const stringAction = action as ActionReducerStringPayloadAction;
  switch (stringAction.payload) {
    case ActionType.PAUSE:
      return copyIntoPauseAction(state);
    case ActionType.SEND_KEY:
      return copyIntoSendKeyPressAction(state);
    default:
      throw new UnhandledActionTypeError(stringAction.payload);
  }
};

const changeEditingActionRoleKey = (
  state: Action,
  action: ActionReducerAction
): Action => {
  const stringAction = action as ActionReducerStringPayloadAction;
  return { ...state, roleKeyId: stringAction.payload };
};

const changeEditingActionName = (
  state: Action,
  action: ActionReducerAction
): Action => {
  const stringAction = action as ActionReducerStringPayloadAction;
  return { ...state, name: stringAction.payload };
};

/**
 * Returns a modified copy of an action value.
 */
const modifyActionValue = <T extends IdValued>(
  actionValue: T,
  eventTargetValue: string,
  operation: ActionReducerActionType
): T => {
  const copy = { ...actionValue };
  switch (operation) {
    case ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE:
      copy.actionValueType = eventTargetValue;
      break;
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE:
      if (copy.variableType === VariableType.RANGE) {
        (copy as RangeValue).value = +eventTargetValue;
      } else {
        (copy as TextValued).value = eventTargetValue;
      }
      break;
    case ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID:
      copy.variableId = eventTargetValue;
      break;
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID:
      copy.roleKeyId = eventTargetValue;
      break;
    default:
      throw new UnhandledActionValueOperationError(operation);
  }
  return copy;
};

/**
 * Returns a modified copy of an action, with a modified action value.
 */
type SKAction = SendKeyAction | SendKeyPressAction | SendKeyHoldReleaseAction;
const modifyAction = (
  state: SendKeyAction,
  field: Field,
  operation: ActionReducerActionType,
  value: string
): SKAction => {
  switch (field) {
    // TODO: the problem here is that only one of these operations is valid for each field
    // -- change type is only valid for radio, change value is only valid for "value"
    // -- might not cause problems now but also isn't as strict as can be
    case Field.AC_KEY_TO_SEND_RADIO:
    case Field.AC_KEY_TO_SEND_VALUE:
    case Field.AC_KEY_TO_SEND_VAR:
    case Field.AC_KEY_TO_SEND_RK:
      const keyToSend = modifyActionValue(state.keyToSend, value, operation);
      return {
        ...state,
        keyToSend,
      };
    case Field.AC_OUTER_PAUSE_RADIO:
    case Field.AC_OUTER_PAUSE_VAR:
    case Field.AC_OUTER_PAUSE_RK:
      const outerPause = modifyActionValue(state.outerPause, value, operation);
      return {
        ...state,
        outerPause,
      };
    case Field.AC_INNER_PAUSE_RADIO:
    case Field.AC_INNER_PAUSE_VAR:
    case Field.AC_INNER_PAUSE_RK:
      const innerPause = modifyActionValue(
        (state as SendKeyPressAction).innerPause,
        value,
        operation
      );
      return {
        ...state,
        innerPause,
      };
    case Field.AC_REPEAT_RADIO:
    case Field.AC_REPEAT_VAR:
    case Field.AC_REPEAT_RK:
      const repeat = modifyActionValue(
        (state as SendKeyPressAction).repeat,
        value,
        operation
      );
      return {
        ...state,
        repeat,
      };
    case Field.AC_DIRECTION_RADIO:
    case Field.AC_DIRECTION_VALUE:
    case Field.AC_DIRECTION_VAR:
    case Field.AC_DIRECTION_RK:
      const direction = modifyActionValue(
        (state as SendKeyHoldReleaseAction).direction,
        value,
        operation
      );
      return {
        ...state,
        direction,
      };
    default:
      throw new UnhandledSendKeyFieldError(field);
  }
};

const changeSendKey = (
  state: Action,
  action: ActionReducerAction
): SendKeyAction => {
  const skState = state as SendKeyAction;
  const skAction = action as ActionReducerChangePayloadAction;
  return modifyAction(
    skState,
    skAction.payload.field,
    action.type,
    skAction.payload.value
  );
};

export const actionReactReducer = (
  state: Action,
  action: ActionReducerAction
): Action => {
  switch (action.type) {
    case ActionReducerActionType.CHANGE_ACTION_TYPE:
      return changeEditingActionType(state, action);
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE:
    case ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE:
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID:
    case ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID:
      return changeSendKey(state, action);
    case ActionReducerActionType.CHANGE_MODIFIERS:
      return toggleModifier(state, action);
    case ActionReducerActionType.CHANGE_NAME:
      return changeEditingActionName(state, action);
    case ActionReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingActionRoleKey(state, action);
    case ActionReducerActionType.CHANGE_SEND_KEY_MODE:
      return changeEditingSendKeyMode(state, action);
    default:
      throw new UnhandledActionEditingEventTypeError(action.type);
  }
};
