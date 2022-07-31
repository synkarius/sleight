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
  createNumericValue,
  createTextValue,
} from './action-value/action-value';

const createTestAction = (id: string): Action => {
  return {
    id: id,
    name: '',
    type: ActionType.Enum.BRING_APP,
    roleKeyId: null,
  };
};

const createTestSendKeyPressAction = (id: string): SendKeyPressAction => {
  return {
    ...createTestAction(id),
    type: ActionType.Enum.SEND_KEY,
    sendKeyMode: SendKeyMode.Enum.PRESS,
    modifiers: {
      control: false,
      alt: false,
      shift: false,
      windows: false,
    },
    keyToSend: createTextValue(),
    outerPause: createNumericValue(),
    innerPause: createNumericValue(),
    repeat: createNumericValue(),
  };
};

const createTestSendKeyHoldReleaseAction = (
  id: string
): SendKeyHoldReleaseAction => {
  return {
    ...createTestAction(id),
    type: ActionType.Enum.SEND_KEY,
    sendKeyMode: SendKeyMode.Enum.HOLD_RELEASE,
    modifiers: {
      control: false,
      alt: false,
      shift: false,
      windows: false,
    },
    keyToSend: createTextValue(),
    outerPause: createNumericValue(),
    direction: createTextValue(),
  };
};

describe('action reducer for send key actions', () => {
  it('should handle change action.sendKeyMode to hold/release', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: SendKeyMode.Enum.HOLD_RELEASE,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual(createTestSendKeyHoldReleaseAction(obj.id));
  });

  it('should handle change action.sendKeyMode to press', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_SEND_KEY_MODE,
      payload: SendKeyMode.Enum.PRESS,
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
