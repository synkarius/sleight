import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import { createTextValue, TextActionValue } from '../action-value';

export interface SendTextAction extends AbstractAction {
  type: typeof ActionType.Enum.SEND_TEXT;
  text: TextActionValue;
}

export const isSendTextAction = (action: Action): action is SendTextAction =>
  action.type === ActionType.Enum.SEND_TEXT;

export const createSendTextAction = (): SendTextAction => ({
  ...createAbstractAction(),
  type: ActionType.Enum.SEND_TEXT,
  text: createTextValue(),
});

export const copyIntoSendTextAction = (action: Action): SendTextAction => ({
  ...copyAction(action),
  type: ActionType.Enum.SEND_TEXT,
  text: createTextValue(),
});
