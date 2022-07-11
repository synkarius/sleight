import { PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../../../util/string-map';
import { Action } from '../../action';
import { changeSendKey } from '../../action-reducers';
import { ActionType } from '../../action-types';
import {
  ChangeActionValuePayload,
  createChoiceValue,
  createRangeValue,
} from '../../action-value/action-value';
import { ActionValueOperation } from '../../action-value/action-value-operation';
import { PauseAction } from '../../pause/pause';
import {
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from '../send-key';
import { SendKeyMode } from '../send-key-modes';
import { SendKeyField } from '../send-key-payloads';

export const createTestAction = (id: string): Action => {
  return {
    id: id,
    name: '',
    type: '',
    roleKeyId: null,
  };
};

export const createTestPauseAction = (id: string): PauseAction => {
  return {
    ...createTestAction(id),
    type: ActionType.PAUSE,
    centiseconds: createRangeValue(),
  };
};

export const createTestSendKeyAction = (
  id: string,
  sendKeyMode: string
): SendKeyAction => {
  return {
    ...createTestAction(id),
    type: ActionType.SEND_KEY,
    sendKeyMode: sendKeyMode,
    modifiers: {
      control: false,
      alt: false,
      shift: false,
      windows: false,
    },
    sendKey: createChoiceValue(),
    outerPause: createRangeValue(),
  };
};

export const createTestSendKeyPressAction = (
  id: string
): SendKeyPressAction => {
  return {
    ...createTestSendKeyAction(id, SendKeyMode.PRESS),
    innerPause: createRangeValue(),
    repeat: createRangeValue(),
  };
};

export const createTestSendKeyHoldReleaseAction = (
  id: string
): SendKeyHoldReleaseAction => {
  return {
    ...createTestSendKeyAction(id, SendKeyMode.HOLD_RELEASE),
    direction: createChoiceValue(),
  };
};

export const createSendKeyReduxAction = (
  eventTargetValue: string,
  operation: ActionValueOperation,
  field: SendKeyField
): PayloadAction<ChangeActionValuePayload<SendKeyField>> => {
  return changeSendKey({
    eventTargetValue: eventTargetValue,
    operation: operation,
    field: field,
  });
};

export const createSavedMap = (obj: Action): ReduxFriendlyStringMap<Action> => {
  const savedMap: ReduxFriendlyStringMap<Action> = {};
  savedMap[obj.id] = obj;
  return savedMap;
};
