import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import { createNumberValue, NumberActionValue } from '../action-value';

export interface PauseAction extends AbstractAction {
  readonly type: typeof ActionType.Enum.PAUSE;
  readonly centiseconds: NumberActionValue;
}

export const isPauseAction = (action: AbstractAction): action is PauseAction =>
  action.type === ActionType.Enum.PAUSE;

export const createPauseAction = (): PauseAction => {
  return {
    ...createAbstractAction(),
    type: ActionType.Enum.PAUSE,
    centiseconds: createNumberValue(),
  };
};

export const copyIntoPauseAction = (action: Action): PauseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.PAUSE,
    centiseconds: createNumberValue(),
  };
};
