import { ExhaustivenessFailureError } from '../../../../error/ExhaustivenessFailureError';
import { UnhandledFieldError } from '../../../../error/UnhandledFieldError';
import { SELECT_DEFAULT_VALUE } from '../../common/consts';
import { VariableType } from '../../variable/variable-types';
import { Action } from '../action';

import {
  ActionReducerActionType,
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../action-editing-context';
import {
  EnterValueType,
  NumericActionValue,
  TextActionValue,
} from '../action-value/action-value';
import { ActionValueType } from '../action-value/action-value-type';
import {
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key';
import {
  directionGroup,
  innerPauseGroup,
  keyToSendGroup,
  outerPauseGroup,
  repeatGroup,
} from './send-key-action-value-type-name-groups';

const changeTextActionValueType = (
  action: ActionReducerActionValueTypePayloadAction
): TextActionValue => {
  const actionValueType = action.payload.actionValueType;
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.TEXT,
        value: '',
      };
    case ActionValueType.Enum.USE_VARIABLE:
      return {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.CHOICE,
        variableId: SELECT_DEFAULT_VALUE,
      };
    case ActionValueType.Enum.USE_ROLE_KEY:
      return {
        actionValueType: ActionValueType.Enum.USE_ROLE_KEY,
        roleKeyId: SELECT_DEFAULT_VALUE,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

const changeNumericActionValueType = (
  action: ActionReducerActionValueTypePayloadAction
): NumericActionValue => {
  const actionValueType = action.payload.actionValueType;
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.NUMERIC,
        value: 0,
      };
    case ActionValueType.Enum.USE_VARIABLE:
      return {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.RANGE,
        variableId: SELECT_DEFAULT_VALUE,
      };
    case ActionValueType.Enum.USE_ROLE_KEY:
      return {
        actionValueType: ActionValueType.Enum.USE_ROLE_KEY,
        roleKeyId: SELECT_DEFAULT_VALUE,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

const changeActionValue = <T extends TextActionValue | NumericActionValue>(
  actionValue: T,
  action: ActionReducerChangePayloadAction
): T => {
  const actionType = action.type;
  switch (actionType) {
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE:
      if (
        actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE &&
        actionValue.enteredValueType === EnterValueType.NUMERIC
      ) {
        return {
          ...actionValue,
          value: +action.payload.value,
        };
      } else {
        return {
          ...actionValue,
          value: action.payload.value,
        };
      }
    case ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID:
      return {
        ...actionValue,
        variableId: action.payload.value,
      };
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID:
      return {
        ...actionValue,
        roleKeyId: action.payload.value,
      };
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};

export const changeSendKey = (
  state: Action,
  action:
    | ActionReducerChangePayloadAction
    | ActionReducerActionValueTypePayloadAction
): SendKeyAction => {
  if (Object.values(keyToSendGroup).includes(action.payload.field)) {
    const ska = state as SendKeyAction;
    return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
      ? { ...ska, keyToSend: changeTextActionValueType(action) }
      : {
          ...ska,
          keyToSend: changeActionValue(ska.keyToSend, action),
        };
  } else if (Object.values(outerPauseGroup).includes(action.payload.field)) {
    const ska = state as SendKeyAction;
    return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
      ? { ...ska, outerPause: changeNumericActionValueType(action) }
      : {
          ...ska,
          outerPause: changeActionValue(ska.outerPause, action),
        };
  } else if (Object.values(innerPauseGroup).includes(action.payload.field)) {
    const skpa = state as SendKeyPressAction;
    return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
      ? { ...skpa, innerPause: changeNumericActionValueType(action) }
      : {
          ...skpa,
          innerPause: changeActionValue(skpa.innerPause, action),
        };
  } else if (Object.values(repeatGroup).includes(action.payload.field)) {
    const skpa = state as SendKeyPressAction;
    return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
      ? { ...skpa, repeat: changeNumericActionValueType(action) }
      : {
          ...skpa,
          repeat: changeActionValue(skpa.repeat, action),
        };
  } else if (Object.values(directionGroup).includes(action.payload.field)) {
    const skhra = state as SendKeyHoldReleaseAction;
    return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
      ? { ...skhra, direction: changeTextActionValueType(action) }
      : {
          ...skhra,
          direction: changeActionValue(skhra.direction, action),
        };
  }
  throw new UnhandledFieldError(action.payload.field);
};
