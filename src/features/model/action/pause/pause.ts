import { getRandomId } from '../../../../util/random-id';
import { Action, copyAction } from '../action';
import { ActionType } from '../action-types';
import {
  createNumericValue,
  NumericActionValue,
} from '../action-value/action-value';

export interface PauseAction extends Action {
  readonly type: typeof ActionType.Enum.PAUSE;
  readonly centiseconds: NumericActionValue;
}

export const createPauseAction = (): PauseAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.PAUSE,
    roleKeyId: undefined,
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
