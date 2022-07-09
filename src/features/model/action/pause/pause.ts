import { getRandomId } from '../../../../util/random-id';
import { Action, copyAction } from '../action';
import { ActionType } from '../action-types';
import { createRangeValue, RangeValue } from '../action-value/action-value';

export interface PauseAction extends Action {
  centiseconds: RangeValue;
}

export const createPauseAction = (): PauseAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.PAUSE,
    roleKeyId: null,
    centiseconds: createRangeValue(),
  };
};

export const copyIntoPauseAction = (action: Action): PauseAction => {
  return {
    ...copyAction(action),
    type: ActionType.PAUSE,
    centiseconds: createRangeValue(),
  };
};
