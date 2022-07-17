import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { createRoleKey, RoleKey } from './role-key';
import { RoleKeyActionType } from './role-key-editing-context';
import {
  RoleKeysState,
  selectRoleKey,
  saveRoleKey,
  deleteEditingRoleKey,
  roleKeyReduxReducer,
  roleKeyReactReducer,
} from './role-key-reducers';

const createSavedMap = (roleKey: RoleKey): ReduxFriendlyStringMap<RoleKey> => {
  const map: ReduxFriendlyStringMap<RoleKey> = {};
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

    expect(actual.editingId).toEqual(undefined);
  });

  it('should handle change value', () => {
    const newObject = createRoleKey();

    const expected = { ...newObject, value: 'asdf' };
    const actual = roleKeyReactReducer(newObject, {
      type: RoleKeyActionType.CHANGE_VALUE,
      payload: 'asdf',
    });

    expect(actual).toEqual(expected);
  });
});
