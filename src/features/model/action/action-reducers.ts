import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { NotImplementedError } from '../../../error/NotImplementedError';
import { UnhandledActionEditingEventTypeError } from '../../../error/UnhandledActionEditingEventTypeError';
import { UnhandledActionValueOperationError } from '../../../error/UnhandledActionValueOperationError';
import { UnhandledFieldError } from '../../../error/UnhandledFieldError';
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
  ActionReducerSendKeyModePayloadAction,
  ActionReducerActionValueTypePayloadAction,
  ActionReducerActionTypePayloadAction,
} from './action-editing-context';
import { ActionType } from './action-types';
import { ChoiceValue, RangeValue, withType } from './action-value/action-value';
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
import {
  directionGroup,
  innerPauseGroup,
  keyToSendGroup,
  outerPauseGroup,
  repeatGroup,
} from './send-key/send-key-action-value-type-name-groups';
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
  action: ActionReducerAction
): Action => {
  const stringAction = action as ActionReducerActionTypePayloadAction;
  switch (stringAction.payload) {
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
      throw new NotImplementedError('action type ' + stringAction.payload);
    default:
      throw new ExhaustivenessFailureError(stringAction.payload);
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
    // change type handled elsewhere
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

const getActionValue = (state: Action, field: Field): IdValued => {
  if (Object.values(keyToSendGroup).includes(field)) {
    return (state as SendKeyAction).keyToSend;
  } else if (Object.values(outerPauseGroup).includes(field)) {
    return (state as SendKeyAction).outerPause;
  } else if (Object.values(innerPauseGroup).includes(field)) {
    return (state as SendKeyPressAction).innerPause;
  } else if (Object.values(repeatGroup).includes(field)) {
    return (state as SendKeyPressAction).repeat;
  } else if (Object.values(directionGroup).includes(field)) {
    return (state as SendKeyHoldReleaseAction).direction;
  }
  throw new UnhandledFieldError(field);
};
const changeActionValue = <T extends IdValued>(
  actionValue: T,
  action:
    | ActionReducerActionValueTypePayloadAction
    | ActionReducerChangePayloadAction
): T => {
  switch (action.type) {
    case ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE:
      const typeAction = action as ActionReducerActionValueTypePayloadAction;
      return {
        ...actionValue,
        actionValueType: typeAction.payload.actionValueType,
      };
    default:
      const stringAction = action as ActionReducerChangePayloadAction;
      switch (action.type) {
        case ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE:
          if (actionValue.variableType === VariableType.RANGE) {
            return {
              ...actionValue,
              value: +stringAction.payload.value,
            };
          } else {
            return {
              ...actionValue,
              value: stringAction.payload.value,
            };
          }
        case ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID:
          return {
            ...actionValue,
            variableId: stringAction.payload.value,
          };
        case ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID:
          return {
            ...actionValue,
            roleKeyId: stringAction.payload.value,
          };
        default:
          throw new UnhandledActionValueOperationError(action.type);
      }
  }
};
const assignIdValuedBack = (
  state: Action,
  field: Field,
  actionValue: IdValued
): SendKeyAction => {
  if (Object.values(keyToSendGroup).includes(field)) {
    return {
      ...(state as SendKeyAction),
      keyToSend: actionValue as ChoiceValue,
    };
  } else if (Object.values(outerPauseGroup).includes(field)) {
    return {
      ...(state as SendKeyAction),
      outerPause: actionValue as RangeValue,
    };
  } else if (Object.values(innerPauseGroup).includes(field)) {
    return {
      ...(state as SendKeyPressAction),
      innerPause: actionValue as RangeValue,
    };
  } else if (Object.values(repeatGroup).includes(field)) {
    return {
      ...(state as SendKeyPressAction),
      repeat: actionValue as RangeValue,
    };
  } else if (Object.values(directionGroup).includes(field)) {
    return {
      ...(state as SendKeyHoldReleaseAction),
      direction: actionValue as ChoiceValue,
    };
  }
  throw new UnhandledFieldError(field);
};

const changeSendKey = (
  state: Action,
  action: ActionReducerAction
): SendKeyAction => {
  const changeSendKeyAction = action as
    | ActionReducerActionValueTypePayloadAction
    | ActionReducerChangePayloadAction;
  // 1: switch to get correct IdValued
  const idValued = getActionValue(state, changeSendKeyAction.payload.field);
  // 2: switch to perform operation on IdValued
  const changed = changeActionValue(idValued, changeSendKeyAction);
  // 3: switch to assign it back
  return assignIdValuedBack(state, changeSendKeyAction.payload.field, changed);
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
