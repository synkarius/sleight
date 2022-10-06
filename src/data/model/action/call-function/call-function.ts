import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import { ActionValue } from '../action-value';
import { UNSELECTED_ID } from '../../../../core/common/consts';

export interface CallFunctionAction extends AbstractAction {
  type: typeof ActionType.Enum.CALL_FUNCTION;
  functionId: string;
  parameters: ActionValue[];
}

export const isCallFunctionAction = (
  action: Action
): action is CallFunctionAction =>
  action.type === ActionType.Enum.CALL_FUNCTION;

export const createCallFunctionAction = (): CallFunctionAction => ({
  ...createAbstractAction(),
  type: ActionType.Enum.CALL_FUNCTION,
  functionId: UNSELECTED_ID,
  parameters: [],
});

export const copyIntoCallFunctionAction = (
  action: Action
): CallFunctionAction => ({
  ...copyAction(action),
  type: ActionType.Enum.CALL_FUNCTION,
  functionId: UNSELECTED_ID,
  parameters: [],
});
