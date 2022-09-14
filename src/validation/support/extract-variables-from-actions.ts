import { NotImplementedError } from '../../error/not-implemented-error';
import { Action } from '../../data/model/action/action';
import { ActionType } from '../../data/model/action/action-types';
import {
  EnumActionValue,
  NumericActionValue,
  TextActionValue,
  VariableChoiceActionValue,
  VariableRangeActionValue,
  VariableTextActionValue,
} from '../../data/model/action/action-value/action-value';
import { ActionValueType } from '../../data/model/action/action-value/action-value-type';
import { SendKeyMode } from '../../data/model/action/send-key/send-key-modes';
import { Field } from '../validation-field';

type ActionAndField = {
  actionId: string;
  field: Field;
};
/** action value, action, field */
type AV_A_F = (TextActionValue | NumericActionValue | EnumActionValue) &
  ActionAndField;
/** variable action value, action field */
type VAV_A_F = (
  | VariableTextActionValue
  | VariableRangeActionValue
  | VariableChoiceActionValue
) &
  ActionAndField;

export const extractVariablesFromAction = (action: Action): VAV_A_F[] => {
  const results: AV_A_F[] = [];
  switch (action.type) {
    case ActionType.Enum.PAUSE:
      results.push({
        ...action.centiseconds,
        actionId: action.id,
        field: Field.AC_CENTISECONDS_VAR,
      });
      break;
    case ActionType.Enum.SEND_KEY:
      results.push({
        ...action.keyToSend,
        actionId: action.id,
        field: Field.AC_SK_KEY_TO_SEND_VAR,
      });
      results.push({
        ...action.outerPause,
        actionId: action.id,
        field: Field.AC_SK_OUTER_PAUSE_VAR,
      });
      if (action.sendKeyMode === SendKeyMode.Enum.PRESS) {
        results.push({
          ...action.innerPause,
          actionId: action.id,
          field: Field.AC_SK_INNER_PAUSE_VAR,
        });
        results.push({
          ...action.repeat,
          actionId: action.id,
          field: Field.AC_SK_REPEAT_VAR,
        });
      } else {
        results.push({
          ...action.direction,
          actionId: action.id,
          field: Field.AC_SK_DIRECTION_VAR,
        });
      }
      break;
    default:
      throw new NotImplementedError('extractVariablesFromAction');
  }
  return results.filter(
    (actionValue): actionValue is VAV_A_F =>
      actionValue.actionValueType === ActionValueType.Enum.USE_VARIABLE
  );
};
