import { ReduxFriendlyStringMap } from '../../../util/structures';
import { Action } from './action';
import { createSendKeyPressAction } from './send-key/send-key';
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
import { getRandomId } from '../../../util/functions';
import { ActionType } from './action-types';
import {
  createChoiceValue,
  createRangeValue,
} from './action-value/action-value';
import { SendKeyMode } from './send-key/send-key-modes';
global.crypto = require('crypto');

const createTestAction = (id: string): PauseAction => {
  return {
    id: id,
    name: '',
    type: ActionType.PAUSE,
    roleKeyId: null,
    centiseconds: createRangeValue(),
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

    expect(actual.editing).toEqual(createTestAction(newObject.id));
  });

  it('should handle save', () => {
    const newObject = createPauseAction();

    const createdState = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );
    const actual = actionReducer(createdState, saveEditingAction());

    const expected: ReduxFriendlyStringMap<Action> = {};
    expected[newObject.id] = createTestAction(newObject.id);

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
    expect(actual.editing).toEqual(createTestAction(newObject.id));
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
      ...createTestAction(newObject.id),
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
      ...createTestAction(newObject.id),
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
    expect(actual.editing).toEqual({
      id: newObject.id,
      name: '',
      type: ActionType.SEND_KEY,
      roleKeyId: null,
      sendKeyMode: SendKeyMode.PRESS,
      modifiers: {
        control: false,
        alt: false,
        shift: false,
        windows: false,
      },
      sendKey: createChoiceValue(),
      outerPause: createRangeValue(),
      innerPause: createRangeValue(),
      repeat: createRangeValue(),
    });
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
    expect(actual.editing).toEqual({
      id: newObject.id,
      name: '',
      type: ActionType.PAUSE,
      roleKeyId: null,
      centiseconds: createRangeValue(),
    });
  });
});
