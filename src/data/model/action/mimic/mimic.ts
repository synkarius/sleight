import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import { createTextValue, TextActionValue } from '../action-value';

export interface MimicAction extends AbstractAction {
  type: typeof ActionType.Enum.MIMIC;
  words: TextActionValue;
}

export const isMimicAction = (action: Action): action is MimicAction =>
  action.type === ActionType.Enum.MIMIC;

export const createMimicAction = (): MimicAction => ({
  ...createAbstractAction(),
  type: ActionType.Enum.MIMIC,
  words: createTextValue(),
});

export const copyIntoMimicAction = (action: Action): MimicAction => ({
  ...copyAction(action),
  type: ActionType.Enum.MIMIC,
  words: createTextValue(),
});
