import { ReduxFriendlyStringMap } from '../../../util/structures';
import { createRoleKey, RoleKey } from './role-key';
import {
  RoleKeysState,
  createNewEditingRoleKey,
  selectRoleKey,
  clearEditingRoleKey,
  changeEditingRoleKeyValue,
  saveEditingRoleKey,
  deleteEditingRoleKey,
  roleKeyReducer,
} from './role-key-reducers';
global.crypto = require('crypto');

describe('role key reducer', () => {
  const initialState: RoleKeysState = {
    saved: {},
    editing: null,
  };
  it('should handle initial state', () => {
    expect(roleKeyReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
    });
  });

  it('should handle create new', () => {
    const newObject = createRoleKey();

    const actual = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );

    expect(actual.editing).toEqual({
      id: newObject.id,
      value: '',
    });
  });

  it('should handle save', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );
    const actual = roleKeyReducer(createdState, saveEditingRoleKey());

    const expected: ReduxFriendlyStringMap<RoleKey> = {};
    expected[newObject.id] = {
      id: newObject.id,
      value: '',
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );
    const savedState = roleKeyReducer(createdState, saveEditingRoleKey());
    const clearedState = roleKeyReducer(savedState, clearEditingRoleKey());

    const actual = roleKeyReducer(clearedState, selectRoleKey(newObject.id));
    expect(actual.editing).toEqual({
      id: newObject.id,
      value: '',
    });
  });

  it('should handle clear', () => {
    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(createRoleKey())
    );

    const actual = roleKeyReducer(createdState, clearEditingRoleKey());

    expect(actual.editing).toBeNull();
  });

  it('should handle change value', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );

    const actual = roleKeyReducer(
      createdState,
      changeEditingRoleKeyValue('asdf')
    );
    expect(actual.editing).toEqual({
      id: newObject.id,
      value: 'asdf',
    });
  });
});
