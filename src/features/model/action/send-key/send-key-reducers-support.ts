import { UnhandledActionValueOperationError } from '../../../../error/UnhandledActionValueOperationError';
import { UnhandledFieldError } from '../../../../error/UnhandledFieldError';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../variable/variable-types';
import { Action } from '../action';
import {
  ActionReducerAction,
  ActionReducerActionType,
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../action-editing-context';
import { ChoiceValue, RangeValue } from '../action-value/action-value';
import { IdValued } from '../action-value/action-value-validation';
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
          if (actionValue.variableType === VariableType.Enum.RANGE) {
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

export const changeSendKey = (
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
