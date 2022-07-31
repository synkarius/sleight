import { Action, copyAction } from '../action';
import {
  createNumericValue,
  createTextValue,
  NumericActionValue,
  TextActionValue,
} from '../action-value/action-value';
import { SendKeyMode } from './send-key-modes';
import { getRandomId } from '../../../../util/random-id';
import { ActionType } from '../action-types';

export interface Modifiers {
  readonly control: boolean;
  readonly alt: boolean;
  readonly shift: boolean;
  readonly windows: boolean;
}

const createModifiers = (): Modifiers => {
  return {
    control: false,
    alt: false,
    shift: false,
    windows: false,
  };
};

interface AbstractSendKeyAction extends Action {
  readonly type: typeof ActionType.Enum.SEND_KEY;
  readonly sendKeyMode: SendKeyMode.Type;
  readonly modifiers: Modifiers;
  // TODO: enforce that this has roleKey:alphabet if using a choice var??
  readonly keyToSend: TextActionValue;
  readonly outerPause: NumericActionValue;
}

export const isSendKeyAction = (
  action: Action
): action is AbstractSendKeyAction => action.type === ActionType.Enum.SEND_KEY;

export interface SendKeyPressAction extends AbstractSendKeyAction {
  readonly sendKeyMode: typeof SendKeyMode.Enum.PRESS;
  readonly innerPause: NumericActionValue;
  readonly repeat: NumericActionValue;
}

export const isSendKeyPressAction = (
  action: AbstractSendKeyAction
): action is SendKeyPressAction =>
  action.sendKeyMode === SendKeyMode.Enum.PRESS;

export const createSendKeyPressAction = (): SendKeyPressAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.SEND_KEY,
    roleKeyId: null,
    sendKeyMode: SendKeyMode.Enum.PRESS,
    modifiers: createModifiers(),
    keyToSend: createTextValue(),
    outerPause: createNumericValue(),
    innerPause: createNumericValue(),
    repeat: createNumericValue(),
  };
};

export const copyIntoSendKeyPressAction = (
  action: Action
): SendKeyPressAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.SEND_KEY,
    sendKeyMode: SendKeyMode.Enum.PRESS,
    modifiers: createModifiers(),
    keyToSend: createTextValue(),
    outerPause: createNumericValue(),
    innerPause: createNumericValue(),
    repeat: createNumericValue(),
  };
};

export interface SendKeyHoldReleaseAction extends AbstractSendKeyAction {
  readonly sendKeyMode: typeof SendKeyMode.Enum.HOLD_RELEASE;
  readonly direction: TextActionValue;
}

export const isSendKeyHoldReleaseAction = (
  action: AbstractSendKeyAction
): action is SendKeyHoldReleaseAction =>
  action.sendKeyMode === SendKeyMode.Enum.HOLD_RELEASE;

export const createSendKeyHoldReleaseAction = (): SendKeyHoldReleaseAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.SEND_KEY,
    roleKeyId: null,
    sendKeyMode: SendKeyMode.Enum.HOLD_RELEASE,
    modifiers: createModifiers(),
    keyToSend: createTextValue(),
    outerPause: createNumericValue(),
    direction: createTextValue(),
  };
};

export const copyIntoSendKeyHoldReleaseAction = (
  action: Action
): SendKeyHoldReleaseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.SEND_KEY,
    sendKeyMode: SendKeyMode.Enum.HOLD_RELEASE,
    modifiers: createModifiers(),
    keyToSend: createTextValue(),
    outerPause: createNumericValue(),
    direction: createTextValue(),
  };
};

export type SendKeyAction = SendKeyPressAction | SendKeyHoldReleaseAction;
