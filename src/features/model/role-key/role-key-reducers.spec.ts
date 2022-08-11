import { createRoleKey, RoleKey } from './role-key';
import { RoleKeyReducerActionType } from './role-key-editing-context';
import {
  RoleKeysState,
  selectRoleKey,
  saveRoleKey,
  deleteEditingRoleKey,
  roleKeyReduxReducer,
  roleKeyReactReducer,
} from './role-key-reducers';

const createSavedMap = (roleKey: RoleKey): Record<string, RoleKey> => {
  const map: Record<string, RoleKey> = {};
  map[roleKey.id] = roleKey;
  return map;
};

describe('role key reducer', () => {
  const initialState: RoleKeysState = {
    saved: {},
    editingId: undefined,
  };
  it('should handle initial state', () => {
    expect(roleKeyReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editingId: undefined,
    });
  });

  it('should handle save', () => {
    const newObject = createRoleKey();

    const expected = createSavedMap(newObject);
    const actual = roleKeyReduxReducer(initialState, saveRoleKey(newObject));

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const objId = 'asdf';

    const prereducerState = {
      saved: {},
      editingId: undefined,
    };

    const actual = roleKeyReduxReducer(prereducerState, selectRoleKey(objId));

    expect(actual.editingId).toEqual(objId);
  });

  it('should handle clear', () => {
    const prereducerState = {
      saved: {},
      editingId: 'asdf',
    };

    const actual = roleKeyReduxReducer(
      prereducerState,
      selectRoleKey(undefined)
    );

    expect(actual.editingId).toBeUndefined();
  });

  it('should handle change value', () => {
    const newObject = createRoleKey();

    const expected = { ...newObject, value: 'asdf' };
    const actual = roleKeyReactReducer(newObject, {
      type: RoleKeyReducerActionType.CHANGE_VALUE,
      payload: 'asdf',
    });

    expect(actual).toEqual(expected);
  });
});
