import {
  createSendKeyHoldReleaseAction,
  createSendKeyPressAction,
} from '../send-key';
import {
  ActionsState,
  actionReducer,
  changeEditingActionType,
  changeEditingSendKeyMode,
  toggleModifier,
} from '../../action-reducers';
import {
  createTestPauseAction,
  createTestSendKeyHoldReleaseAction,
  createTestSendKeyPressAction,
} from './test-utils';
import { createPauseAction } from '../../pause/pause';
import { ActionType } from '../../action-types';
import { SendKeyMode } from '../send-key-modes';
import { SendKeyModifiers } from '../send-key-modifiers';

describe('action reducer for send key actions', () => {
  const initialState: ActionsState = {
    saved: {},
    editing: null,
    validationErrors: [],
  };

  it('should handle change type to send key', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      changeEditingActionType({ actionType: ActionType.SEND_KEY })
    );

    expect(actual.editing).toEqual(createTestSendKeyPressAction(obj.id));
  });

  it('should handle change type to pause', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      changeEditingActionType({ actionType: ActionType.PAUSE })
    );

    expect(actual.editing).toEqual(createTestPauseAction(obj.id));
  });

  it('should handle change action.sendKeyMode to hold/release', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      changeEditingSendKeyMode({ sendKeyMode: SendKeyMode.HOLD_RELEASE })
    );
    expect(actual.editing).toEqual(createTestSendKeyHoldReleaseAction(obj.id));
  });

  it('should handle change action.sendKeyMode to press', () => {
    const obj = createSendKeyHoldReleaseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      changeEditingSendKeyMode({ sendKeyMode: SendKeyMode.PRESS })
    );
    expect(actual.editing).toEqual(createTestSendKeyPressAction(obj.id));
  });

  it('should handle sendKey toggle modifiers', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const ctrlToggledState = actionReducer(
      preReducerState,
      toggleModifier(SendKeyModifiers.CONTROL)
    );
    const altToggledState = actionReducer(
      ctrlToggledState,
      toggleModifier(SendKeyModifiers.ALT)
    );
    const shiftToggledState = actionReducer(
      altToggledState,
      toggleModifier(SendKeyModifiers.SHIFT)
    );
    const actual = actionReducer(
      shiftToggledState,
      toggleModifier(SendKeyModifiers.WINDOWS)
    );

    expect(actual.editing).toEqual({
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
