import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { createRoleKey, RoleKey } from './role-key';
import {
  RoleKeysState,
  createNewEditingRoleKey,
  selectRoleKey,
  clearEditingRoleKey,
  changeEditingRoleKeyValue,
  saveAndClearEditingRoleKey,
  deleteEditingRoleKey,
  roleKeyReducer,
  validateRoleKeyText,
} from './role-key-reducers';
import { roleKeyTextValidator } from './role-key-validation';

describe('role key reducer', () => {
  const initialState: RoleKeysState = {
    saved: {},
    editing: null,
    validationErrors: [],
  };
  it('should handle initial state', () => {
    expect(roleKeyReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
      validationErrors: [],
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
    const actual = roleKeyReducer(createdState, saveAndClearEditingRoleKey());

    const expected: ReduxFriendlyStringMap<RoleKey> = {};
    expected[newObject.id] = {
      id: newObject.id,
      value: '',
    };

    expect(actual.editing).toBeNull();
    expect(actual.saved).toEqual(expected);
  });

  it('should not save if validation errors', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );
    const validatedState = roleKeyReducer(createdState, validateRoleKeyText());
    const actual = roleKeyReducer(validatedState, saveAndClearEditingRoleKey());

    const expected: RoleKey = {
      id: newObject.id,
      value: '',
    };

    expect(actual.editing).toEqual(expected);
    expect(actual.saved).toEqual({});
  });

  it('should handle select', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );
    const savedState = roleKeyReducer(
      createdState,
      saveAndClearEditingRoleKey()
    );
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

  it('should invalidate empty role key', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );

    const validateEmptyState = roleKeyReducer(
      createdState,
      validateRoleKeyText()
    );
    expect(validateEmptyState.validationErrors).toEqual([
      roleKeyTextValidator.error,
    ]);
  });

  it('should validate non-empty role key', () => {
    const newObject = createRoleKey();

    const createdState = roleKeyReducer(
      initialState,
      createNewEditingRoleKey(newObject)
    );

    const nonEmptyState = roleKeyReducer(
      createdState,
      changeEditingRoleKeyValue('asdf')
    );
    const validateNonEmptyState = roleKeyReducer(
      nonEmptyState,
      validateRoleKeyText()
    );
    expect(validateNonEmptyState.validationErrors).toEqual([]);
  });
});
