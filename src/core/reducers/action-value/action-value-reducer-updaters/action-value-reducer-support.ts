import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  ActionReducerActionType,
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../../../../ui/model/action/action-editing-context';
import {
  EnterValueType,
  EnumActionValue,
  NumericActionValue,
  TextActionValue,
} from '../../../../data/model/action/action-value/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';

export const changeTextActionValueType = (
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
        variableType: VariableType.Enum.TEXT,
        variableId: SELECT_DEFAULT_VALUE,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

export const changeNumericActionValueType = (
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
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

export const changeEnumActionValueType = (
  action: ActionReducerActionValueTypePayloadAction
): EnumActionValue => {
  const actionValueType = action.payload.actionValueType;
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.ENUM,
        value: SELECT_DEFAULT_VALUE,
      };
    case ActionValueType.Enum.USE_VARIABLE:
      return {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.CHOICE,
        variableId: SELECT_DEFAULT_VALUE,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

export const changeActionValueValue = <
  T extends TextActionValue | NumericActionValue | EnumActionValue
>(
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
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
