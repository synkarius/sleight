import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { UNSELECTED_ENUM, UNSELECTED_ID } from '../../../common/consts';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  ActionReducerActionType,
  ActionReducerActionValueTypePayloadAction,
  ActionReducerActionValueChangePayloadAction,
} from '../../../../ui/model/action/action-editing-context';
import {
  ActionValue,
  EnumActionValue,
  NumberActionValue,
  TextActionValue,
} from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';

export const changeTextActionValueType = (
  state: TextActionValue,
  action: ActionReducerActionValueTypePayloadAction
): TextActionValue => {
  const actionValueType = action.payload.actionValueType;
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return {
        id: state.id,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.TEXT,
        value: '',
      };
    case ActionValueType.Enum.USE_VARIABLE:
      return {
        id: state.id,
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.TEXT,
        variableId: UNSELECTED_ID,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

export const changeNumberActionValueType = (
  state: NumberActionValue,
  action: ActionReducerActionValueTypePayloadAction
): NumberActionValue => {
  const actionValueType = action.payload.actionValueType;
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return {
        id: state.id,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      };
    case ActionValueType.Enum.USE_VARIABLE:
      return {
        id: state.id,
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.NUMBER,
        variableId: UNSELECTED_ID,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

export const changeEnumActionValueType = (
  state: EnumActionValue,
  action: ActionReducerActionValueTypePayloadAction
): EnumActionValue => {
  const actionValueType = action.payload.actionValueType;
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return {
        id: state.id,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: UNSELECTED_ENUM,
      };
    case ActionValueType.Enum.USE_VARIABLE:
      return {
        id: state.id,
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.ENUM,
        variableId: UNSELECTED_ID,
      };
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

export const changeActionValueValue = <
  T extends TextActionValue | NumberActionValue | EnumActionValue
>(
  actionValue: T,
  action: ActionReducerActionValueChangePayloadAction
): T => {
  const actionType = action.type;
  switch (actionType) {
    case ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE:
      if (
        actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE &&
        actionValue.enteredValueType === VariableType.Enum.NUMBER
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
