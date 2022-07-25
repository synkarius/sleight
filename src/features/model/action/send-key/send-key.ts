import { Action, copyAction } from '../action';
import {
  ChoiceValue,
  createChoiceValue,
  createRangeValue,
  RangeValue,
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
  // see send-key-modes.ts for options -- whether a press or a hold/release
  readonly sendKeyMode: SendKeyMode.Type;
  readonly modifiers: Modifiers;
  // TODO: enforce that this has roleKey:alphabet if using a choice var??
  readonly keyToSend: ChoiceValue;
  readonly outerPause: RangeValue;
}

export interface SendKeyPressAction extends AbstractSendKeyAction {
  readonly sendKeyMode: typeof SendKeyMode.Enum.PRESS;
  readonly innerPause: RangeValue;
  readonly repeat: RangeValue;
}

export const createSendKeyPressAction = (): SendKeyPressAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.SEND_KEY,
    roleKeyId: null,
    sendKeyMode: SendKeyMode.Enum.PRESS,
    modifiers: createModifiers(),
    keyToSend: createChoiceValue(),
    outerPause: createRangeValue(),
    innerPause: createRangeValue(),
    repeat: createRangeValue(),
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
    keyToSend: createChoiceValue(),
    outerPause: createRangeValue(),
    innerPause: createRangeValue(),
    repeat: createRangeValue(),
  };
};

export interface SendKeyHoldReleaseAction extends AbstractSendKeyAction {
  readonly sendKeyMode: typeof SendKeyMode.Enum.HOLD_RELEASE;
  readonly direction: ChoiceValue;
}

export const createSendKeyHoldReleaseAction = (): SendKeyHoldReleaseAction => {
  return {
    id: getRandomId(),
    name: '',
    type: ActionType.Enum.SEND_KEY,
    roleKeyId: null,
    sendKeyMode: SendKeyMode.Enum.HOLD_RELEASE,
    modifiers: createModifiers(),
    keyToSend: createChoiceValue(),
    outerPause: createRangeValue(),
    direction: createChoiceValue(),
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
    keyToSend: createChoiceValue(),
    outerPause: createRangeValue(),
    direction: createChoiceValue(),
  };
};

export type SendKeyAction = SendKeyPressAction | SendKeyHoldReleaseAction;
