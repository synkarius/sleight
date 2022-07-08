import { Context, createContext } from './context';
import {
  ContextsState,
  createNewEditingContext,
  selectContext,
  clearEditingContext,
  changeEditingContextName,
  changeEditingContextRoleKey,
  changeEditingContextType,
  changeEditingContextMatcher,
  saveAndClearEditingContext,
  contextReducer,
  validateEditingContextMatcher,
} from './context-reducers';
import { ContextType } from './context-types';
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { ContextValidationError } from './context-validation';
global.crypto = require('crypto');

describe('context reducer', () => {
  const initialState: ContextsState = {
    saved: {},
    editing: null,
    validationErrors: [],
  };
  it('should handle initial state', () => {
    expect(contextReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
      validationErrors: [],
    });
  });

  it('should handle create new', () => {
    const newContext = createContext();

    const actual = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle save', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );
    const actual = contextReducer(createdState, saveAndClearEditingContext());

    const expected: ReduxFriendlyStringMap<Context> = {};
    expected[newContext.id] = {
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    };

    expect(actual.editing).toBeNull();
    expect(actual.saved).toEqual(expected);
  });

  it('should not save if errors exist', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );
    const validatedState = contextReducer(
      createdState,
      validateEditingContextMatcher()
    );
    // there will be errors because matcher is blank
    const actual = contextReducer(validatedState, saveAndClearEditingContext());

    const expectedEditing = {
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    };

    expect(actual.editing).toEqual(expectedEditing);
    expect(actual.saved).toEqual({});
  });

  it('should handle select', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );
    const savedState = contextReducer(
      createdState,
      saveAndClearEditingContext()
    );
    const clearedState = contextReducer(savedState, clearEditingContext());

    const actual = contextReducer(clearedState, selectContext(newContext.id));
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle clear', () => {
    const createdState = contextReducer(
      initialState,
      createNewEditingContext(createContext())
    );

    const actual = contextReducer(createdState, clearEditingContext());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextName('asdf')
    );
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: 'asdf',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle change role key', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextRoleKey('asdf')
    );
    expect(actual.editing).toEqual({
      roleKeyId: 'asdf',
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle change type', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextType(ContextType.WINDOW_TITLE)
    );
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.WINDOW_TITLE,
      matcher: '',
    });
  });

  it('should handle change matcher', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextMatcher('asdf')
    );
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: 'asdf',
    });
  });

  it('should invalidate blank matcher', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const validateBlankMatcherState = contextReducer(
      createdState,
      validateEditingContextMatcher()
    );
    expect(validateBlankMatcherState.validationErrors).toEqual([
      ContextValidationError.MATCHER_IS_BLANK,
    ]);
  });

  it('should validate non-blank matcher', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const nonBlankMatcherState = contextReducer(
      createdState,
      changeEditingContextMatcher('asdf')
    );
    const validateNonBlankMatcherState = contextReducer(
      nonBlankMatcherState,
      validateEditingContextMatcher()
    );
    expect(validateNonBlankMatcherState.validationErrors).toEqual([]);
  });
});
