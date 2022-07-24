import {
  createSendKeyHoldReleaseAction,
  createSendKeyPressAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key/send-key';
import { actionReactReducer } from './action-reducers';
import { SendKeyMode } from './send-key/send-key-modes';
import { SendKeyModifiers } from './send-key/send-key-modifiers';
import { ActionReducerActionType } from './action-editing-context';
import { Action } from './action';
import { ActionType } from './action-types';
import {
  createChoiceValue,
  createRangeValue,
} from './action-value/action-value';

const createTestAction = (id: string): Action => {
  return {
    id: id,
    name: '',
    type: '',
    roleKeyId: null,
  };
};

const createTestSendKeyAction = (id: string, sendKeyMode: string) => {
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
    keyToSend: createChoiceValue(),
    outerPause: createRangeValue(),
  };
};

const createTestSendKeyPressAction = (id: string): SendKeyPressAction => {
  return {
    ...createTestSendKeyAction(id, SendKeyMode.PRESS),
    innerPause: createRangeValue(),
    repeat: createRangeValue(),
  };
};

const createTestSendKeyHoldReleaseAction = (
  id: string
): SendKeyHoldReleaseAction => {
  return {
    ...createTestSendKeyAction(id, SendKeyMode.HOLD_RELEASE),
    direction: createChoiceValue(),
  };
};

describe('action reducer for send key actions', () => {
  it('should handle change action.sendKeyMode to hold/release', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: SendKeyMode.HOLD_RELEASE,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual(createTestSendKeyHoldReleaseAction(obj.id));
  });

  it('should handle change action.sendKeyMode to press', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: SendKeyMode.PRESS,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual(createTestSendKeyPressAction(obj.id));
  });

  it('should handle sendKey toggle modifiers', () => {
    const obj = createSendKeyPressAction();

    const ctrlToggledState = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_MODIFIERS,
      payload: SendKeyModifiers.CONTROL,
    });
    const altToggledState = actionReactReducer(ctrlToggledState, {
      type: ActionReducerActionType.CHANGE_MODIFIERS,
      payload: SendKeyModifiers.ALT,
    });
    const shiftToggledState = actionReactReducer(altToggledState, {
      type: ActionReducerActionType.CHANGE_MODIFIERS,
      payload: SendKeyModifiers.SHIFT,
    });
    const actual = actionReactReducer(shiftToggledState, {
      type: ActionReducerActionType.CHANGE_MODIFIERS,
      payload: SendKeyModifiers.WINDOWS,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      modifiers: {
        control: true,
        alt: true,
        shift: true,
        windows: true,
      },
    });
  });
});
