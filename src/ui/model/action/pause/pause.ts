import { getRandomId } from '../../../../common/random-id';
import { AbstractAction, copyAction } from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import {
  createNumericValue,
  NumericActionValue,
} from '../action-value/action-value';

export interface PauseAction extends AbstractAction {
  readonly type: typeof ActionType.Enum.PAUSE;
  readonly centiseconds: NumericActionValue;
}

export const isPauseAction = (action: AbstractAction): action is PauseAction =>
  action.type === ActionType.Enum.PAUSE;

export const createPauseAction = (): PauseAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.PAUSE,
    roleKey: '',
    centiseconds: createNumericValue(),
  };
};

export const copyIntoPauseAction = (action: Action): PauseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.PAUSE,
    centiseconds: createNumericValue(),
  };
};
