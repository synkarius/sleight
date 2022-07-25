import { getRandomId } from '../../../../util/random-id';
import { Action, copyAction } from '../action';
import { ActionType } from '../action-types';
import { createRangeValue, RangeValue } from '../action-value/action-value';

export interface PauseAction extends Action {
  readonly type: typeof ActionType.Enum.PAUSE;
  readonly centiseconds: RangeValue;
}

export const createPauseAction = (): PauseAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.PAUSE,
    roleKeyId: null,
    centiseconds: createRangeValue(),
  };
};

export const copyIntoPauseAction = (action: Action): PauseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.PAUSE,
    centiseconds: createRangeValue(),
  };
};
