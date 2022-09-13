import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { NotImplementedError } from '../../error/not-implemented-error';
import { Action } from '../../data/model/action/action';
import {
  ActionReducerAction,
  ActionReducerActionType,
  ActionReducerModifiersPayloadAction,
  ActionReducerStringPayloadAction,
  ActionReducerSendKeyModePayloadAction,
  ActionReducerActionTypePayloadAction,
  ActionReducerMouseActionTypePayloadAction,
  ActionReducerMouseMovementTypePayloadAction,
  ActionReducerNumberPayloadAction,
} from '../../ui/model/action/action-editing-context';
import { ActionType } from '../../data/model/action/action-types';
import { ActionValueUpdater } from './action-value/action-value-reducer-updaters/action-value-updater';
import { getActionValueUpdater } from './action-value/action-value-reducer-updaters/default-action-value-updater';
import {
  copyIntoMouseClickAction,
  copyIntoMouseHoldAction,
  copyIntoMouseMoveAction,
  isMouseAction,
  isMoveMouseAction,
  MoveMouseAction,
} from '../../data/model/action/mouse/mouse';
import { MouseActionType } from '../../data/model/action/mouse/mouse-action-type';
import { MouseMovementType } from '../../data/model/action/mouse/mouse-movement-type';
import { copyIntoPauseAction } from '../../data/model/action/pause/pause';
import {
  copyIntoSendKeyHoldReleaseAction,
  copyIntoSendKeyPressAction,
  Modifiers,
  SendKeyAction,
} from '../../data/model/action/send-key/send-key';
import { SendKeyMode } from '../../data/model/action/send-key/send-key-modes';
import { SendKeyModifiers } from '../../data/model/action/send-key/send-key-modifiers';
import { WrongTypeError } from '../../error/wrong-type-error';

export type ActionsState = {
  saved: Record<string, Action>;
  editingId: string | undefined;
};

const initialState: ActionsState = {
  saved: {},
  editingId: undefined,
};

const injected = getDefaultInjectionContext();
const actionDefaultNamer = injected.default.namers.action;

const addDefaults = (action: Action): Action => {
  return {
    ...action,
    name: action.name.trim() || actionDefaultNamer.getDefaultName(action),
  };
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    selectAction: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveAction: (state, action: PayloadAction<Action>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
    deleteAction: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
  },
});

export const { selectAction, saveAction, deleteAction } = actionsSlice.actions;
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
  action: ActionReducerSendKeyModePayloadAction
): Action => {
  switch (action.payload) {
    case SendKeyMode.Enum.PRESS:
      return copyIntoSendKeyPressAction(state);
    case SendKeyMode.Enum.HOLD_RELEASE:
      return copyIntoSendKeyHoldReleaseAction(state);
    default:
      throw new ExhaustivenessFailureError(action.payload);
  }
};

const changeEditingMouseActionType = (
  state: Action,
  action: ActionReducerMouseActionTypePayloadAction
): Action => {
  switch (action.payload) {
    case MouseActionType.Enum.MOVE:
      return copyIntoMouseMoveAction(state);
    case MouseActionType.Enum.CLICK:
      return copyIntoMouseClickAction(state);
    case MouseActionType.Enum.HOLD_RELEASE:
      return copyIntoMouseHoldAction(state);
    default:
      throw new ExhaustivenessFailureError(action.payload);
  }
};

const changeEditingMouseMovementType = (
  state: MoveMouseAction,
  action: ActionReducerMouseMovementTypePayloadAction
): MoveMouseAction => {
  switch (action.payload) {
    case MouseMovementType.Enum.ABSOLUTE:
      return {
        ...state,
        mouseMovementType: MouseMovementType.Enum.ABSOLUTE,
        x: Math.round(state.x),
        y: Math.round(state.y),
      };
    case MouseMovementType.Enum.RELATIVE:
      return {
        ...state,
        mouseMovementType: MouseMovementType.Enum.RELATIVE,
        x: Math.round(state.x),
        y: Math.round(state.y),
      };
    case MouseMovementType.Enum.WINDOW:
      return {
        ...state,
        mouseMovementType: MouseMovementType.Enum.WINDOW,
        x: Math.min(Math.max(state.x, 1), 0),
        y: Math.min(Math.max(state.y, 1), 0),
      };
    default:
      throw new ExhaustivenessFailureError(action.payload);
  }
};

const changeEditingMouseMovementX = (
  state: MoveMouseAction,
  action: ActionReducerNumberPayloadAction
): MoveMouseAction => ({
  ...state,
  x: action.payload,
});

const changeEditingMouseMovementY = (
  state: MoveMouseAction,
  action: ActionReducerNumberPayloadAction
): MoveMouseAction => ({
  ...state,
  y: action.payload,
});

const changeEditingActionType = (
  state: Action,
  action: ActionReducerActionTypePayloadAction
): Action => {
  switch (action.payload) {
    case ActionType.Enum.PAUSE:
      return copyIntoPauseAction(state);
    case ActionType.Enum.SEND_KEY:
      return copyIntoSendKeyPressAction(state);
    case ActionType.Enum.MOUSE:
      return copyIntoMouseMoveAction(state);
    case ActionType.Enum.BRING_APP:
    case ActionType.Enum.CALL_FUNCTION:
    case ActionType.Enum.MIMIC:
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
  action: ActionReducerStringPayloadAction
): Action => {
  return { ...state, roleKey: action.payload };
};

const changeEditingActionName = (
  state: Action,
  action: ActionReducerStringPayloadAction
): Action => {
  return { ...state, name: action.payload.trim() === '' ? '' : action.payload };
};

const toggleEditingActionEnabled = (state: Action): Action => ({
  ...state,
  enabled: !state.enabled,
});

const toggleEditingActionLocked = (state: Action): Action => ({
  ...state,
  locked: !state.locked,
});

const changeActionValue: ActionValueUpdater = getActionValueUpdater();

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
    case ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID:
      return changeActionValue(state, action);
    case ActionReducerActionType.CHANGE_MODIFIERS:
      return toggleModifier(state, action);
    case ActionReducerActionType.CHANGE_NAME:
      return changeEditingActionName(state, action);
    case ActionReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingActionRoleKey(state, action);
    case ActionReducerActionType.CHANGE_SEND_KEY_MODE:
      return changeEditingSendKeyMode(state, action);
    case ActionReducerActionType.CHANGE_MOUSE_ACTION_TYPE:
      return changeEditingMouseActionType(state, action);
    case ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_TYPE:
      if (isMouseAction(state) && isMoveMouseAction(state)) {
        return changeEditingMouseMovementType(state, action);
      }
      throw new WrongTypeError('CHANGE_MOUSE_MOVEMENT_TYPE');
    case ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_X:
      if (isMouseAction(state) && isMoveMouseAction(state)) {
        return changeEditingMouseMovementX(state, action);
      }
      throw new WrongTypeError('CHANGE_MOUSE_MOVEMENT_X');
    case ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_Y:
      if (isMouseAction(state) && isMoveMouseAction(state)) {
        return changeEditingMouseMovementY(state, action);
      }
      throw new WrongTypeError('CHANGE_MOUSE_MOVEMENT_Y');
    case ActionReducerActionType.TOGGLE_ENABLED:
      return toggleEditingActionEnabled(state);
    case ActionReducerActionType.TOGGLE_LOCKED:
      return toggleEditingActionLocked(state);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
