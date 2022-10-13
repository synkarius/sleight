import {
  createSendKeyHoldReleaseAction,
  createSendKeyPressAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from '../../data/model/action/send-key/send-key';
import { actionReactReducer } from './action-reducers';
import { SendKeyMode } from '../../data/model/action/send-key/send-key-modes';
import { SendKeyModifiers } from '../../data/model/action/send-key/send-key-modifiers';
import { ActionReducerActionType } from '../../ui/model/action/action-editing-context';
import { ActionType } from '../../data/model/action/action-types';
import {
  createEnumValue,
  createNumberValue,
} from '../../data/model/action/action-value';

const createTestSendKeyPressAction = (id: string): SendKeyPressAction => {
  return {
    id: id,
    name: '',
    roleKey: '',
    type: ActionType.Enum.SEND_KEY,
    enabled: true,
    locked: false,
    sendKeyMode: SendKeyMode.Enum.PRESS,
    modifiers: {
      control: false,
      alt: false,
      shift: false,
      windows: false,
    },
    keyToSend: { ...createEnumValue(), id: expect.any(String) },
    outerPause: { ...createNumberValue(), id: expect.any(String) },
    innerPause: { ...createNumberValue(), id: expect.any(String) },
    repeat: { ...createNumberValue(), id: expect.any(String) },
  };
};

const createTestSendKeyHoldReleaseAction = (
  id: string
): SendKeyHoldReleaseAction => {
  return {
    id: id,
    name: '',
    roleKey: '',
    type: ActionType.Enum.SEND_KEY,
    enabled: true,
    locked: false,
    sendKeyMode: SendKeyMode.Enum.HOLD_RELEASE,
    modifiers: {
      control: false,
      alt: false,
      shift: false,
      windows: false,
    },
    keyToSend: { ...createEnumValue(), id: expect.any(String) },
    outerPause: { ...createNumberValue(), id: expect.any(String) },
    direction: { ...createEnumValue(), id: expect.any(String) },
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
