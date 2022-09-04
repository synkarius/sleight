import { AbstractAction, copyAction } from '../abstract-action';
import {
  createEnumValue,
  createNumericValue,
  createTextValue,
  EnumActionValue,
  NumericActionValue,
  TextActionValue,
} from '../action-value/action-value';
import { SendKeyMode } from './send-key-modes';
import { getRandomId } from '../../../../common/random-id';
import { ActionType } from '../action-types';
import { Action } from '../action';

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

interface AbstractSendKeyAction extends AbstractAction {
  readonly type: typeof ActionType.Enum.SEND_KEY;
  readonly sendKeyMode: SendKeyMode.Type;
  readonly modifiers: Modifiers;
  // TODO: enforce that this has roleKey:alphabet if using a choice var??
  readonly keyToSend: EnumActionValue;
  readonly outerPause: NumericActionValue;
}

export const isSendKeyAction = (action: Action): action is SendKeyAction =>
  action.type === ActionType.Enum.SEND_KEY;

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
    roleKey: '',
    sendKeyMode: SendKeyMode.Enum.PRESS,
    modifiers: createModifiers(),
    keyToSend: createEnumValue(),
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
    keyToSend: createEnumValue(),
    outerPause: createNumericValue(),
    innerPause: createNumericValue(),
    repeat: createNumericValue(),
  };
};

export interface SendKeyHoldReleaseAction extends AbstractSendKeyAction {
  readonly sendKeyMode: typeof SendKeyMode.Enum.HOLD_RELEASE;
  readonly direction: EnumActionValue;
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
    roleKey: '',
    sendKeyMode: SendKeyMode.Enum.HOLD_RELEASE,
    modifiers: createModifiers(),
    keyToSend: createEnumValue(),
    outerPause: createNumericValue(),
    direction: createEnumValue(),
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
    keyToSend: createEnumValue(),
    outerPause: createNumericValue(),
    direction: createEnumValue(),
  };
};

export type SendKeyAction = SendKeyPressAction | SendKeyHoldReleaseAction;
