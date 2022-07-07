import { ReduxFriendlyStringMap } from '../../../util/structures';
import { Action } from './action';
import {
  createSendKeyHoldReleaseAction,
  createSendKeyPressAction,
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from './send-key/send-key';
import {
  ActionsState,
  createNewEditingAction,
  selectAction,
  clearEditingAction,
  changeEditingActionName,
  changeEditingActionRoleKey,
  changeEditingActionType,
  saveEditingAction,
  // send-key
  changeEditingSendKeyMode,
  // send-key key to send
  changeKeyToSendActionValueType,
  changeKeyToSendValue,
  changeKeyToSendVariableId,
  changeKeyToSendRoleKeyId,
  // send-key modifiers
  toggleModifier,
  // send-key outer pause
  changeOuterPauseActionValueType,
  changeOuterPauseValue,
  changeOuterPauseVariableId,
  changeOuterPauseRoleKeyId,
  // send-key inner pause
  changeInnerPauseActionValueType,
  changeInnerPauseValue,
  changeInnerPauseVariableId,
  changeInnerPauseRoleKeyId,
  // send-key repeat
  changeRepeatActionValueType,
  changeRepeatValue,
  changeRepeatVariableId,
  changeRepeatRoleKeyId,
  // send-key direction
  changeDirectionActionValueType,
  changeDirectionValue,
  changeDirectionVariableId,
  changeDirectionRoleKeyId,
  actionReducer,
} from './action-reducers';
import { createPauseAction, PauseAction } from './pause/pause';
import { ActionType } from './action-types';
import {
  createChoiceValue,
  createRangeValue,
} from './action-value/action-value';
import { SendKeyMode } from './send-key/send-key-modes';
import { ActionValueType } from './action-value/action-value-type';
import { SendKeyModifiers } from './send-key/send-key-modifiers';
global.crypto = require('crypto');

const createTestAction = (id: string): Action => {
  return {
    id: id,
    name: '',
    type: '',
    roleKeyId: null,
  };
};

const createTestPauseAction = (id: string): PauseAction => {
  return {
    ...createTestAction(id),
    type: ActionType.PAUSE,
    centiseconds: createRangeValue(),
  };
};

const createTestSendKeyAction = (
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

describe('action reducer', () => {
  const initialState: ActionsState = {
    saved: {},
    editing: null,
  };
  it('should handle initial state', () => {
    expect(actionReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
    });
  });

  it('should handle create new', () => {
    const newObject = createPauseAction();

    const actual = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    expect(actual.editing).toEqual(createTestPauseAction(newObject.id));
  });

  it('should handle save', () => {
    const newObject = createPauseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );
    const actual = actionReducer(createdState, saveEditingAction());

    const expected: ReduxFriendlyStringMap<Action> = {};
    expected[newObject.id] = createTestPauseAction(newObject.id);

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const newObject = createPauseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );
    const savedState = actionReducer(createdState, saveEditingAction());
    const clearedState = actionReducer(savedState, clearEditingAction());

    const actual = actionReducer(clearedState, selectAction(newObject.id));
    expect(actual.editing).toEqual(createTestPauseAction(newObject.id));
  });

  it('should handle clear', () => {
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(createPauseAction())
    );

    const actual = actionReducer(createdState, clearEditingAction());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const newObject = createPauseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeEditingActionName('asdf'));
    expect(actual.editing).toEqual({
      ...createTestPauseAction(newObject.id),
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const newObject = createPauseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeEditingActionRoleKey('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestPauseAction(newObject.id),
      roleKeyId: 'asdf',
    });
  });

  it('should handle change type to send key', () => {
    const newObject = createPauseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeEditingActionType({ actionType: ActionType.SEND_KEY })
    );

    expect(actual.editing).toEqual(createTestSendKeyPressAction(newObject.id));
  });

  it('should handle change type to pause', () => {
    const newObject = createSendKeyPressAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeEditingActionType({ actionType: ActionType.PAUSE })
    );

    expect(actual.editing).toEqual(createTestPauseAction(newObject.id));
  });

  it('should handle change sendKey.sendKeyMode to hold/release', () => {
    const newObject = createSendKeyPressAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeEditingSendKeyMode({ sendKeyMode: SendKeyMode.HOLD_RELEASE })
    );
    expect(actual.editing).toEqual(
      createTestSendKeyHoldReleaseAction(newObject.id)
    );
  });

  it('should handle change sendKey.sendKeyMode to press', () => {
    const newObject = createSendKeyHoldReleaseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeEditingSendKeyMode({ sendKeyMode: SendKeyMode.PRESS })
    );
    expect(actual.editing).toEqual(createTestSendKeyPressAction(newObject.id));
  });

  it('should handle sendKey toggle modifiers', () => {
    const newObject = createSendKeyHoldReleaseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );
    const ctrlToggledState = actionReducer(
      createdState,
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
      altToggledState,
      toggleModifier(SendKeyModifiers.WINDOWS)
    );

    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      modifiers: {
        control: true,
        alt: true,
        shift: true,
        windows: true,
      },
    });
  });

  ////////////////

  it('should handle change sendKey keyToSend actionValueType', () => {
    const newObject = createSendKeyPressAction();
    newObject.sendKey.actionValueType = ActionValueType.USE_ROLE_KEY;
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeKeyToSendActionValueType(ActionValueType.ENTER_VALUE)
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      sendKey: {
        ...newObject.sendKey,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change sendKey keyToSend value', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeKeyToSendValue('asdf'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      sendKey: {
        ...newObject.sendKey,
        value: 'asdf',
      },
    });
  });

  it('should handle change sendKey keyToSend variableId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeKeyToSendVariableId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      sendKey: {
        ...newObject.sendKey,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change sendKey keyToSend roleKeyId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeKeyToSendRoleKeyId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      sendKey: {
        ...newObject.sendKey,
        roleKeyId: 'asdf',
      },
    });
  });

  /////////////////

  it('should handle change sendKey outerPause actionValueType', () => {
    const newObject = createSendKeyPressAction();
    newObject.outerPause.actionValueType = ActionValueType.USE_ROLE_KEY;
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeOuterPauseActionValueType(ActionValueType.ENTER_VALUE)
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      outerPause: {
        ...newObject.outerPause,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change sendKey outerPause value', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeOuterPauseValue('123'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      outerPause: {
        ...newObject.outerPause,
        value: 123,
      },
    });
  });

  it('should handle change sendKey outerPause variableId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeOuterPauseVariableId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      outerPause: {
        ...newObject.outerPause,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change sendKey outerPause roleKeyId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeOuterPauseRoleKeyId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      outerPause: {
        ...newObject.outerPause,
        roleKeyId: 'asdf',
      },
    });
  });

  /////////////////

  it('should handle change sendKey innerPause actionValueType', () => {
    const newObject = createSendKeyPressAction();
    newObject.innerPause.actionValueType = ActionValueType.USE_ROLE_KEY;
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeInnerPauseActionValueType(ActionValueType.ENTER_VALUE)
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      innerPause: {
        ...newObject.innerPause,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change sendKey innerPause value', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeInnerPauseValue('123'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      innerPause: {
        ...newObject.innerPause,
        value: 123,
      },
    });
  });

  it('should handle change sendKey innerPause variableId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeInnerPauseVariableId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      innerPause: {
        ...newObject.innerPause,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change sendKey innerPause roleKeyId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeInnerPauseRoleKeyId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      innerPause: {
        ...newObject.innerPause,
        roleKeyId: 'asdf',
      },
    });
  });

  /////////////////

  it('should handle change sendKey repeat actionValueType', () => {
    const newObject = createSendKeyPressAction();
    newObject.repeat.actionValueType = ActionValueType.USE_ROLE_KEY;
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeRepeatActionValueType(ActionValueType.ENTER_VALUE)
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      repeat: {
        ...newObject.repeat,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change sendKey repeat value', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeRepeatValue('123'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      repeat: {
        ...newObject.repeat,
        value: 123,
      },
    });
  });

  it('should handle change sendKey repeat variableId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeRepeatVariableId('asdf'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      repeat: {
        ...newObject.repeat,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change sendKey repeat roleKeyId', () => {
    const newObject = createSendKeyPressAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeRepeatRoleKeyId('asdf'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyPressAction(newObject.id),
      repeat: {
        ...newObject.repeat,
        roleKeyId: 'asdf',
      },
    });
  });

  /////////////////

  it('should handle change sendKey direction actionValueType', () => {
    const newObject = createSendKeyHoldReleaseAction();
    newObject.direction.actionValueType = ActionValueType.USE_ROLE_KEY;
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeDirectionActionValueType(ActionValueType.ENTER_VALUE)
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyHoldReleaseAction(newObject.id),
      direction: {
        ...newObject.direction,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change sendKey direction value', () => {
    const newObject = createSendKeyHoldReleaseAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(createdState, changeDirectionValue('asdf'));
    expect(actual.editing).toEqual({
      ...createTestSendKeyHoldReleaseAction(newObject.id),
      direction: {
        ...newObject.direction,
        value: 'asdf',
      },
    });
  });

  it('should handle change sendKey direction variableId', () => {
    const newObject = createSendKeyHoldReleaseAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeDirectionVariableId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyHoldReleaseAction(newObject.id),
      direction: {
        ...newObject.direction,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change sendKey direction roleKeyId', () => {
    const newObject = createSendKeyHoldReleaseAction();
    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    const actual = actionReducer(
      createdState,
      changeDirectionRoleKeyId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestSendKeyHoldReleaseAction(newObject.id),
      direction: {
        ...newObject.direction,
        roleKeyId: 'asdf',
      },
    });
  });
});
