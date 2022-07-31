import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { NotImplementedError } from '../../../error/NotImplementedError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { Action } from './action';
import {
  ActionReducerAction,
  ActionReducerActionType,
  ActionReducerModifiersPayloadAction,
  ActionReducerStringPayloadAction,
  ActionReducerSendKeyModePayloadAction,
  ActionReducerActionTypePayloadAction,
} from './action-editing-context';
import { ActionType } from './action-types';
import { copyIntoPauseAction } from './pause/pause';
import {
  copyIntoSendKeyHoldReleaseAction,
  copyIntoSendKeyPressAction,
  Modifiers,
  SendKeyAction,
} from './send-key/send-key';
import { SendKeyMode } from './send-key/send-key-modes';
import { SendKeyModifiers } from './send-key/send-key-modifiers';
import { changeSendKey } from './send-key/send-key-reducers-support';

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
  action: ActionReducerModifiersPayloadAction
): SendKeyAction => {
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
        throw new ExhaustivenessFailureError(toggle);
    }
  };
  const sendKeyAction = state as SendKeyAction;
  return {
    ...sendKeyAction,
    modifiers: getNewModifiers(sendKeyAction.modifiers, action.payload),
  };
};

const changeEditingSendKeyMode = (
  state: Action,
  action: ActionReducerAction
): Action => {
  const skmAction = action as ActionReducerSendKeyModePayloadAction;
  switch (skmAction.payload) {
    case SendKeyMode.Enum.PRESS:
      return copyIntoSendKeyPressAction(state);
    case SendKeyMode.Enum.HOLD_RELEASE:
      return copyIntoSendKeyHoldReleaseAction(state);
    default:
      throw new ExhaustivenessFailureError(skmAction.payload);
  }
};

const changeEditingActionType = (
  state: Action,
  action: ActionReducerActionTypePayloadAction
): Action => {
  switch (action.payload) {
    case ActionType.Enum.PAUSE:
      return copyIntoPauseAction(state);
    case ActionType.Enum.SEND_KEY:
      return copyIntoSendKeyPressAction(state);
    case ActionType.Enum.BRING_APP:
    case ActionType.Enum.CALL_FUNCTION:
    case ActionType.Enum.MIMIC:
    case ActionType.Enum.MOUSE_CLICK:
    case ActionType.Enum.SEND_TEXT:
    case ActionType.Enum.WAIT_FOR_WINDOW:
      // TODO: implement all
      throw new NotImplementedError('action type ' + action.payload);
    default:
      throw new ExhaustivenessFailureError(action.payload);
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

export const actionReactReducer = (
  state: Action,
  action: ActionReducerAction
): Action => {
  const actionType = action.type;
  switch (actionType) {
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
      throw new ExhaustivenessFailureError(actionType);
  }
};
