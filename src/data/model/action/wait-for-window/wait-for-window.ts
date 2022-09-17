import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import {
  createEnumValue,
  createNumericValue,
  EnumActionValue,
  NumericActionValue,
} from '../action-value';

export interface WaitForWindowAction extends AbstractAction {
  type: typeof ActionType.Enum.WAIT_FOR_WINDOW;
  executable: EnumActionValue;
  title: EnumActionValue;
  waitSeconds: NumericActionValue;
}

export const isWaitForWindowAction = (
  action: Action
): action is WaitForWindowAction =>
  action.type === ActionType.Enum.WAIT_FOR_WINDOW;

export const createWaitForWindowAction = (): WaitForWindowAction => ({
  ...createAbstractAction(),
  type: ActionType.Enum.WAIT_FOR_WINDOW,
  executable: createEnumValue(),
  title: createEnumValue(),
  waitSeconds: createNumericValue(),
});

export const copyIntoWaitForWindowAction = (
  action: Action
): WaitForWindowAction => ({
  ...copyAction(action),
  type: ActionType.Enum.WAIT_FOR_WINDOW,
  executable: createEnumValue(),
  title: createEnumValue(),
  waitSeconds: createNumericValue(),
});
