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
global.crypto = require('crypto');

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

  // it('should handle create new', () => {
  //   const newObject = createSendKeyPressAction();

  //   const actual = actionReducer(
  //     initialState,
  //     createNewEditingAction(newObject)
  //   );

  //   expect(actual.editing).toEqual({
  //     id: newObject.id,
  //     value: '',
  //   });
  // });

  // it('should handle save', () => {
  //   const newObject = createSendKeyPressAction();

  //   const createdState = actionReducer(
  //     initialState,
  //     createNewEditingAction(newObject)
  //   );
  //   const actual = actionReducer(createdState, saveEditingAction());

  //   const expected: ReduxFriendlyStringMap<Action> = {};
  //   expected[newObject.id] = {
  //     id: newObject.id,
  //     value: '',
  //   };

  //   expect(actual.saved).toEqual(expected);
  // });

  // it('should handle select', () => {
  //   const newObject = createRoleKey();

  //   const createdState = actionReducer(
  //     initialState,
  //     createNewEditingRoleKey(newObject)
  //   );
  //   const savedState = actionReducer(createdState, saveEditingRoleKey());
  //   const clearedState = actionReducer(savedState, clearEditingRoleKey());

  //   const actual = actionReducer(clearedState, selectRoleKey(newObject.id));
  //   expect(actual.editing).toEqual({
  //     id: newObject.id,
  //     value: '',
  //   });
  // });

  // it('should handle clear', () => {
  //   const createdState = actionReducer(
  //     initialState,
  //     createNewEditingRoleKey(createRoleKey())
  //   );

  //   const actual = actionReducer(createdState, clearEditingRoleKey());

  //   expect(actual.editing).toBeNull();
  // });

  // it('should handle change value', () => {
  //   const newObject = createRoleKey();

  //   const createdState = actionReducer(
  //     initialState,
  //     createNewEditingRoleKey(newObject)
  //   );

  //   const actual = actionReducer(
  //     createdState,
  //     changeEditingRoleKeyValue('asdf')
  //   );
  //   expect(actual.editing).toEqual({
  //     id: newObject.id,
  //     value: 'asdf',
  //   });
  // });
});
